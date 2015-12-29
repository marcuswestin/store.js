var LocalStorage = require('node-localstorage').LocalStorage
global.localStorage = new LocalStorage('/tmp/store.js-test')

var tests = require('./tests')

module.exports = {
	run: run
}

function run(store, callback) {
	tests.outputError = function(msg) {
		callback(err)
	}
	tests.output = function(msg) {
		console.log(msg)
	}
	tests.runFirstPass(store)
	tests.runSecondPass(store)
	callback()
}
