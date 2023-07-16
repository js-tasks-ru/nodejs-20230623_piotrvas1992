const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        res.statusCode = 400;
        res.end('Nested path');

        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('file already exists');

        return;
      }

      const limitedStream = new LimitSizeStream({limit: 1024 * 1024});
      const outStream = fs.createWriteStream(filepath);

      req.pipe(limitedStream).pipe(outStream);

      limitedStream.on('error', (err)=>{
        fs.unlinkSync(filepath);
        res.statusCode = 413;
        res.end('large file');
      });

      limitedStream.on('finish', ()=>{
        res.statusCode = 201;
        res.end('Created');
      });

      res.on('close', ()=>{
        if (req.aborted && fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
