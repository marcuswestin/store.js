var engine = require('../src/store-engine')

var storages = [
	require('../storages/localStorage')
]

module.exports = engine.createStore(storages)
