var engine = require('../store-engine')

var storages = require('../../storages/all')
var plugins = [require('../../plugins/json2')]

module.exports = engine.createStore(storages, plugins)
