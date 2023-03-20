var engine = require('../src/store-engine')

var storages = [
	require('../storages/localStorage')
]
var plugins = []

module.exports = engine.createStore(storages, plugins)
