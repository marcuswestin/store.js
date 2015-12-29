#!/usr/local/bin/node

var nodeTestRunner = require('../tests/node-test-runner')
var store = require('../src/store')

console.log('Run tests')
nodeTestRunner.run(store, function(err){
	if (err) { throw err }
	console.log("All tests passed")
})
