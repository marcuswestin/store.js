#!/usr/local/bin/node

var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var UglifyJS = require('uglify-js')
var base = __dirname + '/..'

module.exports = {
	run: run,
}

if (require.main === module) {
	main()
}

function main() {
	run(function(err) {
		if (err) { throw err }
	})
}

function run(callback) {
	compilePluginBuilds(function(err) {
		if (err) { return callback(err) }
		compileStoreBuilds(function(err) {
			if (err) { return callback(err) }
			callback()
		})
	})
}

function compilePluginBuilds(callback) {
	var dir = base+'/plugins'
	var out = base+'/dist/plugins'
	fs.readdir(dir, function(err, items) {
		next()
		function next() {
			var item = items.shift()
			if (!item) {
				return callback()
			}
			if (item[0] == '.') {
				return next()
			}
			if (item.match(/_tests?.js$/)) {
				return next()
			}
			if (item == 'lib' || item == 'all.js') {
				return next()
			}
			var pluginFile = path.resolve(dir+'/'+item)
			var input = 'tmp/store-plugin-build.js'
			fs.writeFileSync(input, 'store.addPlugin(require("'+pluginFile+'"))')
			var output = path.resolve(out+'/'+item.replace(/\.js$/, '.min.js'))
			compileFile(input, output, {}, function(err) {
				if (err) { return callback(err) };
				next()
			})
		}
	})
}

function compileStoreBuilds(callback) {
	var dir = base+'/builds'
	var out = base+'/dist'
	fs.readdir(dir, function(err, items) {
		next()
		function next() {
			var item = items.shift()
			if (!item) {
				return callback()
			}
			if (item[0] == '.' || item == 'plugins') {
				return next()
			}
			if (item.match(/\.min\.js$/)) {
				return next()
			}
			var input = path.resolve(dir+'/'+item)
			var output = path.resolve(out+'/'+item.replace(/\.js$/, '.min.js'))
			compileFile(input, output, { standalone:'store', expose:'store' }, function(err) {
				if (err) {
					return callback(err)
				}
				next()
			})
		}
	})
}

function compileFile(input, output, opts, callback) {
	console.log('compile', input, '->', output)
	var copyright = '/* store.js - Copyright (c) 2010-2017 Marcus Westin */'
	                                                             // TODO: sourcemaps - depends on https://github.com/mishoo/UglifyJS2/issues/520
	browserify([input], opts)  // TODO: sourcemaps - use `debug:true`
		.transform('babelify', { presets:['es2015'] })           // TODO: sourcemaps - use `sourceMaps:true`
		.bundle(processResult)
	
	function processResult(err, buf) {
		if (err) { return callback(err) }
		var code = buf.toString()
		code = minify(code)
		var result = copyright+'\n'+code
		fs.writeFile(output, result, function(err) {
			if (err) { return callback(err) }
			var b = Buffer.byteLength(result, 'utf8')
			var k = Math.round(b/1000)
			console.log(k+'k \t('+b+')')
			callback()
		})
	}
}

function minify(code) {
	var minified = UglifyJS.minify(code, {
		fromString: true,
		compress: { screw_ie8:false },
		mangle:   { screw_ie8:false },
		output:   { screw_ie8:false },
		// warnings: true,
		// mangleProperties: { reserved:[] },
	})
	return minified.code // TODO: sourcemaps - use `result.map`.
}
