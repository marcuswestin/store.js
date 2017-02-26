var engine = require('../engine')

var allStorages = require('../storage/all')
var allPlugins = require('../plugin/all')

module.exports = engine.createStore(allStorages, allPlugins)
