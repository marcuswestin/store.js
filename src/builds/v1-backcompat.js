var engine = require('../engine')

var storages = [
	require('../storage/localStorage'),
	require('../storage/oldIE-userDataStorage'),
]
var plugins = [
	require('../plugin/v1-backcompat'),
	require('../plugin/json2'),
]

module.exports = engine.createStore(storages, plugins)
