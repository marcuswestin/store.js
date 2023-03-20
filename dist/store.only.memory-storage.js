var engine = require('../src/store-engine')

var storages = [
	require('../storages/memoryStorage')
]
var plugins = []

module.exports = engine.createStore(storages, plugins)
