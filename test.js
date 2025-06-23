const http = require('http');
const assert = require('assert');
const startServer = require('./server');

const PORT = 4000;
const server = startServer(PORT);

http.get(`http://localhost:${PORT}/api/categories`, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const categories = JSON.parse(data);
      assert(Array.isArray(categories));
      console.log('Tests passed');
      server.close();
    } catch (err) {
      console.error('Test failed', err);
      server.close(() => process.exit(1));
    }
  });
}).on('error', err => {
  console.error('Request failed', err);
  server.close(() => process.exit(1));
});
