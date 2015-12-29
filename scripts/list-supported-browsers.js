#!/usr/local/bin/node

var username = 'storejs'
var password = new Buffer('ZjhjMzUyNjgtNzc2ZC00ZjlkLWEwNWUtN2FkM2Q0ZDgyNzk5', 'base64').toString('utf8')
var saucelabs = require('./util/saucelabs')

saucelabs.setAuth(username, password)
saucelabs.listAllSupportedPlatforms(function(err, res) {
	if (err) { throw err }
	console.log(res)
})