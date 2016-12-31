# await-repl
## Wrapper for `repl.start()`

await-repl is a simple wrapper for [repl.start()](https://nodejs.org/api/repl.html#repl_repl_start_options) that handles lines starting with 'await ' differently: instead of outputting the Promise (or value) it only returns when the Promise is resolved or rejected

### Example
```javascript
const awaitRepl = require('await-repl');
awaitRepl({
  rejectionHandler: (err) => 'Promise rejection: ' + err,
  awaitTimeout: 2000
});
```

### Options
await-repl passes options to `repl.start()`  
#### Additional options
- __rejectionHandler__  
  function for formatting Promise-rejections  
  it is passed a `callback(err, res)` for returning the formatted error to the repl  
  returning a value is the same as calling `callback(returnValue)`
- __awaitTimeout__  
  number of milliseconds before giving up waiting for Promises to be resolved  
  will act like a Promise-rejection with `new awaitRepl.AwaitTimeout()`

### REPL
```javascript
> await 42
42
> await Promise.resolve(73)
73
> await new Promise((resolve, reject) => setTimeout(() => resolve('foo'), 1000))
/* After 1 second */
'foo'
>
```

#### Previous behavior
```javascript
> 42
42
> Promise.resolve(73)
Promise { 73 }
> new Promise((resolve, reject) => setTimeout(() => resolve('foo'), 1000))
Promise { <pending> }
>
```

### Limitations
Works only for lines __starting__ with 'await ' so things like the following don´t work:
```javascript
> let a = await getSomeValueFromDatabase(...)
```
