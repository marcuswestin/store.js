#!/usr/local/bin/node

var fs = require('fs')
var browserify = require('browserify')

module.exports = {
	run: run
}

if (require.main === module) {
	console.log('compiling store.min.js & store+json2.min.js')
	run(function(err){
		if (err) { throw err }
		console.log('done')
	})
}

function run(callback) {
	compileFile('store.min.js', ['store.js'], function(err) {
		if (err) { return callback(err) }
		compileFile('store+json2.min.js', ['store.js', 'json.js'], function(err) {
			if (err) { return callback(err) }
			callback()
		})
	})
}

function compileFile(filename, files, callback) {
	var base = __dirname + '/..'
	var copyright = '/* Copyright (c) 2010-2016 Marcus Westin */'
	browserify(files)
		.transform('uglifyify')
		.bundle(function(err, buf) {
			if (err) { return callback(err) }
			fs.writeFile(base+'/'+filename, copyright+'\n'+buf, function(err) {
				if (err) { return callback(err) }
				callback()
			})
		})
}