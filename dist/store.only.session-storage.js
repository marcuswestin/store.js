var engine = require('../src/store-engine')

var storages = [
	require('../storages/sessionStorage')
]
var plugins = []

module.exports = engine.createStore(storages, plugins)
