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
        'User-Agent': 'Skybags-Deploy-Script',
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

async function uploadImagesToGitHub() {
  console.log('=== Pushing All Image Files directly to GitHub Repository ===');

  // 1. Get current branch ref
  const refData = await githubRequest('GET', `/git/ref/heads/${branch}`);
  const currentCommitSha = refData.object.sha;
  console.log('Current commit SHA:', currentCommitSha);

  // 2. Get current commit details to get base_tree
  const commitData = await githubRequest('GET', `/git/commits/${currentCommitSha}`);
  const baseTreeSha = commitData.tree.sha;
  console.log('Base tree SHA:', baseTreeSha);

  // 3. Scan public/images folder
  const baseDir = path.join(__dirname, '..', 'public');
  const treeEntries = [];

  function scanFolder(dir, relPath = 'public') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const rel = `${relPath}/${entry.name}`;
      if (entry.isDirectory()) {
        scanFolder(fullPath, rel);
      } else if (entry.isFile()) {
        const fileBuffer = fs.readFileSync(fullPath);
        const b64 = fileBuffer.toString('base64');
        treeEntries.push({ fullPath, repoPath: rel.replace(/\\/g, '/'), b64 });
      }
    }
  }

  scanFolder(baseDir);
  console.log(`Found ${treeEntries.length} files in public/ to push to GitHub.`);

  // 4. Create blobs for each file
  const treeObjects = [];
  for (let i = 0; i < treeEntries.length; i++) {
    const item = treeEntries[i];
    console.log(`[${i + 1}/${treeEntries.length}] Creating blob for ${item.repoPath}...`);
    const blobRes = await githubRequest('POST', '/git/blobs', {
      content: item.b64,
      encoding: 'base64'
    });
    treeObjects.push({
      path: item.repoPath,
      mode: '100644',
      type: 'blob',
      sha: blobRes.sha
    });
  }

  // 5. Create new tree
  console.log('Creating new git tree with all image blobs...');
  const newTree = await githubRequest('POST', '/git/trees', {
    base_tree: baseTreeSha,
    tree: treeObjects
  });
  console.log('New tree SHA:', newTree.sha);

  // 6. Create new commit
  console.log('Creating commit...');
  const newCommit = await githubRequest('POST', '/git/commits', {
    message: 'Add all product images to public/images for Netlify static hosting',
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

  console.log('=== All image files successfully pushed to GitHub! ===');
}

uploadImagesToGitHub().catch((err) => {
  console.error('Fatal error during image push:', err);
  process.exit(1);
});
