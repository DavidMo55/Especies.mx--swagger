const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assets = require('swagger-ui-dist').getAbsoluteFSPath();
const routes = {
 '/': [path.join(__dirname, 'index.html'), 'text/html; charset=utf-8'],
 '/openapi.json': [path.join(__dirname, 'openapi.json'), 'application/json; charset=utf-8'],
 '/swagger-ui.css': [path.join(assets, 'swagger-ui.css'), 'text/css'],
 '/swagger-ui-bundle.js': [path.join(assets, 'swagger-ui-bundle.js'), 'application/javascript']
};
const server = http.createServer((req, res) => {
 const route = routes[new URL(req.url, 'http://localhost').pathname];
 if (!route || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404); return res.end('Not found'); }
 fs.readFile(route[0], (error, body) => {
  if (error) { res.writeHead(500); return res.end('Error al leer archivo'); }
  res.writeHead(200, {'Content-Type': route[1], 'Cache-Control': 'no-store'});
  res.end(req.method === 'HEAD' ? undefined : body);
 });
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(Number(process.env.PORT || 8080), '127.0.0.1', () => console.log(`Swagger UI: http://localhost:${server.address().port}`));
