global.localStorage = new require('node-localstorage').LocalStorage('/tmp/store.js-test')

var tests = require('./tests')

tests.outputError = function(msg) {
	throw new Error(msg)
}
tests.output = function(msg) {
	console.log(msg)
}
tests.runFirstPass()
tests.runSecondPass()

console.log("All tests passed")