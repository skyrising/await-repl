const awaitRepl = require('..');

awaitRepl({
  rejectionHandler: (err) => 'Promise rejection: ' + err,
  awaitTimeout: 2000
});
