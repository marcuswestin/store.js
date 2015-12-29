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
	compileFile('store.js', function(err) {
		if (err) { return callback(err) }
		compileFile('store+json2.js', function(err) {
			if (err) { return callback(err) }
			callback()
		})
	})
}

function compileFile(filename, callback) {
	var base = __dirname + '/..'
	var copyright = '/* Copyright (c) 2010-2016 Marcus Westin */'
	browserify([base+'/src/'+filename], { standalone:'store', expose:'store' })
		.transform('uglifyify')
		.bundle(function(err, buf) {
			if (err) { return callback(err) }
			fs.writeFile(base+'/'+filename.replace('.js', '.min.js'), copyright+'\n'+buf, function(err) {
				if (err) { return callback(err) }
				callback()
			})
		})
}