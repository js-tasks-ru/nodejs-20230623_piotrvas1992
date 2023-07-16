const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filePath = path.join(__dirname, 'files', pathname);

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Nested path');

    return;
  }

  switch (req.method) {
    case 'GET':
      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);

          res.on('close', () => {
            stream.destroy();
          });
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
