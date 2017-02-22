var engine = require('../engine')

var storages = [
	require('../storage/localStorage'),
	require('../storage/oldIE-userDataStorage')
]
var addons = [
	require('../addon/v1-backcompat'),
	require('../addon/json2')
]

module.exports = engine.createStore(storages, addons)
