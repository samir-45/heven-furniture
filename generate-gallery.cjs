const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('./public/images').filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Haven Furniture Gallery</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
    h1 { margin-bottom: 20px; font-weight: 300; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .card { background: #2a2a2a; border-radius: 8px; overflow: hidden; padding: 10px; }
    .img-wrap { width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: #000; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .name { margin-top: 8px; font-size: 13px; color: #d4af37; font-weight: 500; }
  </style>
</head>
<body>
  <h1>Heaven Furniture Mart — Image Catalog</h1>
  <div class="grid">
    ${files.map(f => `
      <div class="card">
        <div class="img-wrap">
          <img src="/images/${f}" alt="${f}" />
        </div>
        <div class="name">${f}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync('./public/gallery.html', html);
console.log('Gallery written successfully to public/gallery.html with ' + files.length + ' images.');
