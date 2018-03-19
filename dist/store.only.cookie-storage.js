var engine = require('../src/store-engine')

var storages = [
	require('../storages/cookieStorage')
]
var plugins = []

module.exports = engine.createStore(storages, plugins)
