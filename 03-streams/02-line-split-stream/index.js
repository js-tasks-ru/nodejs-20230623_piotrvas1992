const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(line) {
  console.log(line);
}

lines.on('data', onData);

lines.write(`первая строка`);
lines.write(`вторая строка${os.EOL}третья строка`);
lines.write(`четвертая строка`);

lines.end();
