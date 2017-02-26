var engine = require('../store-engine')

var storages = [
	require('../../storages/localStorage'),
	require('../../storages/cookieStorage'), // for Safari private mode
]
var noAddons = null

module.exports = engine.createStore(storages, noAddons)
