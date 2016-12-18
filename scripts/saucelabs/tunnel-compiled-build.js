#!/usr/local/bin/node

var tunnel = require('./util/tunnel')
tunnel.setup(9576, true, function(err, url) {
	if (err) { throw err }
	console.log('Tunnel open:', url)
})