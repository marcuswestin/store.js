var port = 9575
var tunnel = require('./saucelabs/tunnel')

tunnel.setup(port, 'storejs', function(err, url) {
	if (err) { throw err }
	console.log("Tunnel up and running at", url)
})
