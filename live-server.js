const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '5500', 10);
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

let clients = [];
let reloadDebounce = null;

function notifyClients() {
  if (reloadDebounce) clearTimeout(reloadDebounce);
  reloadDebounce = setTimeout(() => {
    console.log('[Live Server] File change detected, triggering browser reload...');
    clients.forEach(res => {
      try {
        res.write('data: reload\n\n');
      } catch (e) {}
    });
  }, 100);
}

try {
  fs.watch(ROOT, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.startsWith('.') && filename !== 'live-server.js') {
      notifyClients();
    }
  });
} catch (e) {
  console.log('[Live Server] Recursive watch fallback');
}

const LIVE_RELOAD_SCRIPT = `
<!-- Live Server Hot Reload -->
<script>
(function() {
  try {
    const evtSource = new EventSource('/__live_reload__');
    evtSource.onmessage = function(e) {
      if (e.data === 'reload') {
        console.log('[Live Server] Reloading page...');
        window.location.reload();
      }
    };
  } catch (err) {}
})();
</script>
`;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/__live_reload__') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('retry: 1500\n\n');
    clients.push(res);
    req.on('close', () => {
      clients = clients.filter(c => c !== res);
    });
    return;
  }

  if (pathname.startsWith('/_vercel/')) {
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    res.end('/* Vercel Insights Local Mock */');
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT, pathname);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      if (contentType.startsWith('text/html')) {
        let html = data.toString('utf-8');
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${LIVE_RELOAD_SCRIPT}</body>`);
        } else {
          html += LIVE_RELOAD_SCRIPT;
        }
        res.end(html);
      } else {
        res.end(data);
      }
    });
  });
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🚀 Live Server running at:`);
    console.log(`   http://localhost:${port}/`);
    console.log(`   http://127.0.0.1:${port}/`);
    console.log(`⚡ Live reload is active`);
    console.log(`========================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
