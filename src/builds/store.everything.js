var engine = require('../store-engine')

var storages = require('../../storages/all')
var plugins = require('../../plugins/all')

module.exports = engine.createStore(storages, plugins)
