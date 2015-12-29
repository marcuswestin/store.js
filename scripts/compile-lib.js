#!/usr/local/bin/node

var fs = require('fs')
var browserify = require('browserify')

var base = __dirname + '/..'
var copyright = '/* Copyright (c) 2010-2016 Marcus Westin */'

browserify()
	.add(base+'/store.js')
	.transform('uglifyify')
	.bundle(fileWriter('store.min.js'))

browserify()
	.add(base+'/json.js', { noParse:true })
	.add(base+'/store.js')
	.transform('uglifyify')
	.bundle(fileWriter('store+json2.min.js'))

function fileWriter(filename) {
	return function(err, buf) {
		if (err) { throw err }
		fs.writeFileSync(base+'/'+filename, copyright+'\n'+buf)
		console.log('compiled', filename)
	}
}