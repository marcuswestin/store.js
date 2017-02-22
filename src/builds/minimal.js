var engine = require('../engine')

var storages = [
	require('../storage/localStorage')
]
var addons = [
]

module.exports = engine.createStore(storages, addons)
