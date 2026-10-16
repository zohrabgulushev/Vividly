const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

if (fs.existsSync(dist)) {
  const indexHtml = path.join(dist, 'index.html');
  const rootIndexHtml = path.join(root, 'index.html');

  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, rootIndexHtml);
    console.log('[copy-dist] Copied dist/index.html to ./index.html');
  }

  const distExpo = path.join(dist, '_expo');
  const rootExpo = path.join(root, '_expo');
  if (fs.existsSync(distExpo)) {
    fs.cpSync(distExpo, rootExpo, { recursive: true });
    console.log('[copy-dist] Copied dist/_expo to ./_expo');
  }
}
