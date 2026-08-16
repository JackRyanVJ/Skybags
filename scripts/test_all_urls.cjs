const https = require('https');
const fs = require('fs');

const productsJs = fs.readFileSync('c:/Users/varad/Downloads/TY BBA/Skybags/src/data/products.js', 'utf8');
const urls = [];
const regex = /https:\/\/zocvgaubtabpgknzpzyx\.supabase\.co\/storage\/v1\/object\/public\/product-images\/[^\s',"]+/g;
let match;
while ((match = regex.exec(productsJs)) !== null) {
  if (!urls.includes(match[0])) urls.push(match[0]);
}

console.log('Testing', urls.length, 'unique Supabase CDN URLs...');
let done = 0;
let errors = 0;

urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error('FAIL (' + res.statusCode + '):', url);
      errors++;
    }
    done++;
    if (done === urls.length) {
      console.log('Finished testing all URLs. Success:', urls.length - errors, 'Failures:', errors);
    }
  }).on('error', (e) => {
    console.error('ERROR:', e.message, url);
    errors++;
    done++;
    if (done === urls.length) {
      console.log('Finished testing all URLs. Success:', urls.length - errors, 'Failures:', errors);
    }
  });
});
