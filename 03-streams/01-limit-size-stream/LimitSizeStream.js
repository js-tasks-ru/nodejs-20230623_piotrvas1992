const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.totalBytes = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.totalBytes += chunk.length;

    if (this.totalBytes > this.limit) {
      callback(new LimitExceededError());

      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
