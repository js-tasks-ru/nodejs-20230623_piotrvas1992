const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    const linesArray = chunk.toString().split(os.EOL);

    if (linesArray.length === 1) {
      this.buffer += linesArray[0];
    } else {
      this.push(this.buffer + linesArray[0]);
      this.buffer = linesArray[linesArray.length - 1];

      linesArray.forEach((line, index) => {
        if (index ===linesArray.length - 1) return;

        if (index > 0) {
          this.push(line);
        }
      });
    }

    callback();
  }

  _flush(callback) {
    if (this.buffer) {
      this.push(this.buffer);
    }
    this.buffer = null;
    callback();
  }
}

module.exports = LineSplitStream;
