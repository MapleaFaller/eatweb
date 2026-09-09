/* ============================================================
   server.js —— 极简静态文件服务器（Node，无任何依赖）
   用途：本地预览。浏览器从 file:// 打开页面时无法 fetch 本地
        xlsx（浏览器安全限制），必须通过 HTTP 访问：
            node server.js
        然后打开 http://localhost:8000/
   也可直接双击 start-server.bat。
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8000;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer((req, res) => {
    let urlPath;
    try {
        urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        res.writeHead(400).end('Bad Request');
        return;
    }
    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, st) => {
        if (err || !st.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + urlPath);
            return;
        }
        const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('============================================================');
    console.log('  交我吃 · ver0.2 本地服务器已启动');
    console.log(`  请在浏览器打开:  http://127.0.0.1:${PORT}/`);
    console.log(`  或:              http://localhost:${PORT}/`);
    console.log('  保持本窗口开启 = 服务运行中；按 Ctrl + C 停止');
    console.log('============================================================');
});
