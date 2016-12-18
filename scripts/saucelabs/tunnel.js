var budo = require('budo')
var ngrok = require('ngrok')

module.exports = {
	setup: setup
}

function setup(port, compiled, callback) {
	console.log("Creating tunnel - this might take a few seconds")
	startServer(port, compiled, function(err) {
		if (err) { return callback(err) }
		startTunnel(port, function(err, url) {
			if (err) { return callback(err) }
			callback(null, url)
		})
	})
}

function startTunnel(port, callback) {
	// return callback(null, 'https://07f51ed4.ngrok.io')
	var authtoken = new Buffer('NTJuelB1dUpVSDNycDNjZ3pldHVEXzVnWlNObkpuMlFaR013WjZ0eUZUQw==', 'base64').toString('utf8')
	ngrok.connect({ addr:port, name:'storejs-test', authtoken:authtoken }, function(err, url) {
		if (err) { return error(err) }
		url = url.replace('https:', 'http:')
		callback(null, url)
	})
}

function startServer(port, compiled, callback) {
	var budo = require('budo')
	budo(__dirname+'/../../tests/browser-test-runner-'+(compiled ? 'compiled' : 'live')+'.js', {
		stream: process.stdout,
		port: port,
		title: 'store.js browser tests',
		browserify: { transform: 'uglifyify' }
	}).on('connect', function(ev) {
		callback()
	})
}