#!/usr/local/bin/node

var fs = require('fs'),
	uglify = require('uglify-js')

var storeJS = fs.readFileSync(__dirname + '/store.js').toString(),
	jsonJS = fs.readFileSync(__dirname + '/json.js').toString(),
	copy = '/* Copyright (c) 2010-2013 Marcus Westin */'

console.log('building and minifying...')
buildFile(storeJS, 'store.min.js')
buildFile(jsonJS + '\n\n' + storeJS, 'store+json2.min.js')
console.log('done')

function buildFile(js, name) {
	var ast = uglify.parser.parse(js)
	ast = uglify.uglify.ast_mangle(ast)
	ast = uglify.uglify.ast_squeeze(ast)
	var minifiedJS = uglify.uglify.gen_code(ast)
	fs.writeFile(__dirname + '/' + name, copy + '\n' + minifiedJS + ';')
}

