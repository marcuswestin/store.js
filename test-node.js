global.localStorage = require('localStorage')
store = require('./store')

require('./tests')

tests.outputError = function(msg) { console.error(msg); process.exit(-1) }
tests.runFirstPass()
tests.runSecondPass()

console.log("All tests passed")