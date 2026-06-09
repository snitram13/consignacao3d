/* ============================================================
   Consignações 3D — Servidor (backend)
   ------------------------------------------------------------
   • Guarda TODOS os dados num ficheiro (data.json) no servidor,
     por isso ficam iguais no telemóvel e no computador.
   • Sem dependências externas: corre só com o Node.
   • Protegido por palavra-passe (defina em APP_PASSWORD).
   ============================================================ */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = process.env.PORT || 3000;
const PASSWORD  = process.env.APP_PASSWORD || 'mudar-esta-palavra-passe';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');
const INDEX     = path.join(__dirname, 'public', 'index.html');

function readData() {
  try { return fs.readFileSync(DATA_FILE, 'utf8'); }
  catch (e) { return JSON.stringify({ clients: [], me: {} }); }
}
function writeData(s) { fs.writeFileSync(DATA_FILE, s); }

function authorized(req) {
  const h = req.headers['authorization'] || '';
  const token = h.replace(/^Bearer\s+/i, '').trim();
  return token && token === PASSWORD;
}

function send(res, code, type, body) {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  // permite usar o frontend mesmo alojado noutro domínio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = req.url.split('?')[0];

  // ---- API de dados ----
  if (url === '/api/data') {
    if (!authorized(req)) return send(res, 401, 'application/json', '{"error":"unauthorized"}');

    if (req.method === 'GET') {
      return send(res, 200, 'application/json', readData());
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', c => { body += c; if (body.length > 8e6) req.destroy(); });
      req.on('end', () => {
        try {
          JSON.parse(body);            // valida que é JSON
          writeData(body);             // grava no servidor
          send(res, 200, 'application/json', '{"ok":true}');
        } catch (e) {
          send(res, 400, 'application/json', '{"error":"json invalido"}');
        }
      });
      return;
    }
    return send(res, 405, 'application/json', '{"error":"metodo nao permitido"}');
  }

  // ---- verifica palavra-passe (usado no ecrã de login) ----
  if (url === '/api/login' && req.method === 'GET') {
    return authorized(req)
      ? send(res, 200, 'application/json', '{"ok":true}')
      : send(res, 401, 'application/json', '{"error":"unauthorized"}');
  }

  // ---- frontend ----
  if (url === '/' || url === '/index.html') {
    fs.readFile(INDEX, (e, buf) => {
      if (e) return send(res, 500, 'text/plain', 'index.html nao encontrado');
      send(res, 200, 'text/html; charset=utf-8', buf);
    });
    return;
  }

  send(res, 404, 'text/plain', 'Nao encontrado');
});

server.listen(PORT, () => {
  console.log('Consignações 3D a correr em http://localhost:' + PORT);
  if (PASSWORD === 'mudar-esta-palavra-passe') {
    console.log('⚠  Defina a variável APP_PASSWORD com a sua palavra-passe!');
  }
});
