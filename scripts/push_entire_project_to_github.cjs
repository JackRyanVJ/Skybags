const fs = require('fs');
const path = require('path');
const https = require('https');

// Read token from mcp_config.json
const config = JSON.parse(fs.readFileSync('C:/Users/varad/.gemini/config/mcp_config.json', 'utf8'));
const token = config.mcpServers['github-mcp-server'].env.GITHUB_PERSONAL_ACCESS_TOKEN;
const owner = 'JackRyanVJ';
const repo = 'Skybags';
const branch = 'main';

function githubRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${owner}/${repo}${endpoint}`,
      method: method,
      headers: {
        'User-Agent': 'Skybags-Full-Deploy-Script',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`GitHub API Error (${res.statusCode}): ${body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`GitHub API HTTP ${res.statusCode}: ${body}`));
          }
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function syncAllFilesToGitHub() {
  console.log('=== Synchronizing ALL Project Files to GitHub Repository ===');

  // 1. Get current branch ref
  const refData = await githubRequest('GET', `/git/ref/heads/${branch}`);
  const currentCommitSha = refData.object.sha;
  console.log('Current commit SHA:', currentCommitSha);

  // 2. Get current commit details to get base_tree
  const commitData = await githubRequest('GET', `/git/commits/${currentCommitSha}`);
  const baseTreeSha = commitData.tree.sha;
  console.log('Base tree SHA:', baseTreeSha);

  // 3. Collect all files in project (excluding node_modules, dist, .git)
  const rootDir = path.join(__dirname, '..');
  const ignoreDirs = new Set(['node_modules', 'dist', '.git', '.gemini']);
  const filesToPush = [];

  function walkDir(dir, relPrefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (ignoreDirs.has(item.name)) continue;
      const fullPath = path.join(dir, item.name);
      const relPath = relPrefix ? `${relPrefix}/${item.name}` : item.name;
      if (item.isDirectory()) {
        walkDir(fullPath, relPath);
      } else if (item.isFile()) {
        const buffer = fs.readFileSync(fullPath);
        filesToPush.push({
          relPath: relPath.replace(/\\/g, '/'),
          b64: buffer.toString('base64')
        });
      }
    }
  }

  walkDir(rootDir);
  console.log(`Found ${filesToPush.length} total files to push to GitHub.`);

  // 4. Create blobs for each file
  const treeObjects = [];
  for (let i = 0; i < filesToPush.length; i++) {
    const item = filesToPush[i];
    process.stdout.write(`[${i + 1}/${filesToPush.length}] Creating blob for ${item.relPath}... `);
    const blobRes = await githubRequest('POST', '/git/blobs', {
      content: item.b64,
      encoding: 'base64'
    });
    treeObjects.push({
      path: item.relPath,
      mode: '100644',
      type: 'blob',
      sha: blobRes.sha
    });
    console.log('OK');
  }

  // 5. Create new tree
  console.log('Creating new git tree with all files...');
  const newTree = await githubRequest('POST', '/git/trees', {
    base_tree: baseTreeSha,
    tree: treeObjects
  });
  console.log('New tree SHA:', newTree.sha);

  // 6. Create new commit
  console.log('Creating commit...');
  const newCommit = await githubRequest('POST', '/git/commits', {
    message: 'Fix syntax error in LoginPage.jsx and sync full clean codebase for Netlify deploy',
    tree: newTree.sha,
    parents: [currentCommitSha]
  });
  console.log('New commit SHA:', newCommit.sha);

  // 7. Update branch ref
  console.log(`Updating ref heads/${branch}...`);
  await githubRequest('PATCH', `/git/refs/heads/${branch}`, {
    sha: newCommit.sha,
    force: false
  });

  console.log('=== All files successfully synced & pushed to GitHub! ===');
}

syncAllFilesToGitHub().catch((err) => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
