'use strict';

const repl = require('repl');

module.exports = (options) => {
  options = options || {};
  const rejHandler = options.rejectionHandler || (e => e);
  let r = repl.start(options);
  const origEval = r.eval;
  r.eval = (code, context, file, cb) => {
    if (code.indexOf('await ') === 0) 
      origEval(code.substr(6), context, file, (err, res) => {
        if (err) {
          cb(err);
          return;
        }
        let timedOut = false;
        const handleError = (error) => {
          error = rejHandler(error, cb)
          if(error)
            cb(error);
        }
        let timeout;
        if(options.awaitTimeout) {
          timeout = setTimeout(() => {
            timedOut = true;
            handleError(new AwaitTimeout())
          }, options.awaitTimeout)
        }
        Promise.resolve(res)
          .then((result) => {
            if(!timedOut)
              cb(null, result);
            if(timeout)
              clearTimeout(timeout);
          })
          .catch((error) => {
            if(!timedOut)
              handleError(error);
            if(timeout)
              clearTimeout(timeout);
          })
      })
    else
      origEval(code, context, file, cb);
  }
  return t;
}

class AwaitTimeout extends Error {
  constructor(message) {
    super(message);
    this.name = 'AwaitTimeout';
  }
}

module.exports.AwaitTimeout = AwaitTimeout;
