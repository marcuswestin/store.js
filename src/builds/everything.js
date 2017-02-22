var engine = require('../engine')

var allStorages = require('../storage/all')
var allAddons = require('../addon/all')

module.exports = engine.createStore(allStorages, allAddons)
