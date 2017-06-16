// https://github.com/marcuswestin/store.js/issues/215

var engine = require('../../src/store-engine');

const store1 = engine.createStore([
    require('../../storages/localStorage'),
], [
    require('../../plugins/expire'),
]);


var store2 = store1.namespace('store2');
var store3 = store1.namespace('store3');

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
