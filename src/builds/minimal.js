var engine = require('../engine')

var storages = [
	require('../storage/localStorage'),
	require('../storage/cookieStorage'), // for Safari private mode
]
var noAddons = null

module.exports = engine.createStore(storages, noAddons)
