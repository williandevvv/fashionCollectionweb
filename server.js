const http = require('http');
const path = require('path');
const fs = require('fs');

function startServer(port = process.env.PORT || 3000) {
  const server = http.createServer((req, res) => {
    if (req.url === '/api/categories') {
      fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unable to load data' }));
        } else {
          const info = JSON.parse(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(info.categories));
        }
      });
      return;
    }

    // Serve static files
    let filePath = path.join(__dirname, req.url);
    if (req.url === '/' || req.url === '/index.html') {
      filePath = path.join(__dirname, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type =
      ext === '.js'
        ? 'text/javascript'
        : ext === '.css'
        ? 'text/css'
        : ext === '.json'
        ? 'application/json'
        : ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.svg'
        ? 'image/svg+xml'
        : 'text/html';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': type });
        res.end(content);
      }
    });
  });

  return server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio actual
app.use(express.static(__dirname));

// Ruta para obtener categorías desde products.json
app.get('/api/categories', (req, res) => {
  fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to load data' });
    } else {
      const info = JSON.parse(data);
      res.json(info.categories);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

