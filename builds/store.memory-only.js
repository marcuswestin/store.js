var engine = require('../src/store-engine')

var storages = [require('../storages/memoryStorage')]
var plugins = null

module.exports = engine.createStore(storages, plugins)
