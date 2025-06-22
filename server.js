const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
