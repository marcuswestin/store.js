/* eslint semi: "off", indent: "off" */
// https://github.com/marcuswestin/store.js/issues/215

var engine = require('../../src/store-engine');
var storages = [require('../../storages/memoryStorage')];
var plugins = [require('../../plugins/expire')];

const store1 = engine.createStore(storages, plugins, '');
const store2 = engine.createStore(storages, plugins, 'store2');
const store3 = engine.createStore(storages, plugins, 'store3');

var time = Math.floor(new Date().getTime() / 10) * 10
var expiration1 = time + 1001
var expiration2 = null
var expiration3 = time + 3003

var key = 'foo'
var val = 'bar'

store1.set(key, val, expiration1)
store2.set(key, val, expiration2)
store3.set(key, val, expiration3)

assert(store1.getExpiration(key) == expiration1)
assert(store2.getExpiration(key) == expiration2)
assert(store3.getExpiration(key) == expiration3)
