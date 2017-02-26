var engine = require('../store-engine')

var allStorages = require('../../storages/all')
var allPlugins = require('../../plugins/all')

module.exports = engine.createStore(allStorages, allPlugins)
