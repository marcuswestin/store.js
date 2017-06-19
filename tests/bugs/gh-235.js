/* eslint semi: "off", indent: "off" */
// https://github.com/marcuswestin/store.js/issues/235

var engine = require('../../src/store-engine');

const store = engine.createStore([
    require('../../storages/localStorage')
], [
    require('../../plugins/expire'),
    require('../../plugins/events')
]);

store.set('foo', 'bar', new Date().getTime() - 1);
store.set('foo', 'bar');

localStorage.setItem('foo', '"whatever"'); // not necessary
localStorage.setItem('__storejs_expire_mixin_foo', '1495720533386');

store.set('foo', 'bar');
