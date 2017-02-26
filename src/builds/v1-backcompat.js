var engine = require('../store-engine')

var storages = [
	require('../../storages/localStorage'),
	require('../../storages/oldIE-userDataStorage'),
]
var plugins = [
	require('../../plugins/v1-backcompat'),
	require('../../plugins/json2'),
]

module.exports = engine.createStore(storages, plugins)
