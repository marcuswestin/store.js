var engine = require('../engine')

var allStorages = require('../storage/all')
var plugins = [
	require('../plugin/json2'),
]

module.exports = engine.createStore(allStorages, plugins)
