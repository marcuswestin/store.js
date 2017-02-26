var engine = require('../engine')

var allStorages = require('../../storages/all')
var plugins = [
	require('../../plugins/json2'),
]

module.exports = engine.createStore(allStorages, plugins)
