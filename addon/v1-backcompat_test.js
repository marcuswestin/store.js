var { each } = require('../util')

var backcompatMixin = require('./v1-backcompat')

module.exports = {
	setup: setup
}

function setup(store) {

	test('backwards compatability with v1', function() {
		assert('disabled'    in store)
		assert('version'     in store)
		assert('set'         in store)
		assert('get'         in store)
		assert('has'         in store)
		assert('remove'      in store)
		assert('clear'       in store)
		assert('transact'    in store)
		assert('getAll'      in store)
		assert('forEach'     in store)
		assert('serialize'   in store)
		assert('deserialize' in store)
		
		assert(store.disabled !== undefined)
		assert(store.version !== undefined)
		assert(store.set !== undefined)
		assert(store.get !== undefined)
		assert(store.has !== undefined)
		assert(store.remove !== undefined)
		assert(store.clear !== undefined)
		assert(store.transact !== undefined)
		assert(store.getAll !== undefined)
		assert(store.forEach !== undefined)
		assert(store.serialize !== undefined)
		assert(store.deserialize !== undefined)
		
		store.transact('foosact', function(val) {
			assert(typeof val == 'object', "new key is not an object at beginning of transaction")
			val.foo = 'foo'
		})
		store.transact('foosact', function(val) {
			assert(val.foo == 'foo', "first transaction did not register")
			val.bar = 'bar'
		})
		assert(store.get('foosact').bar == 'bar', "second transaction did not register")
	})

}