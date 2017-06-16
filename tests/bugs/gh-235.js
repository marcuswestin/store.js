var engine = require('../../src/store-engine');

const store = engine.createStore([
    require('../../storages/localStorage')
], [
    require('../../plugins/expire'),
    require('../../plugins/events')
]);


localStorage.setItem('foo', '"whatever"'); // not necessary
localStorage.setItem('__storejs_expire_mixin_foo', '1495720533386');

store.set('foo', 'bar');
