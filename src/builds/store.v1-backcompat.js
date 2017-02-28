var engine = require('../store-engine')

var storages = require('../../storages/all')
var plugins = [require('../../plugins/v1-backcompat')]

module.exports = engine.createStore(storages, plugins)
