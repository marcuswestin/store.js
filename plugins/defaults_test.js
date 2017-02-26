require('./defaults')

module.exports = {
	setup: setup,
}

function setup(store) {
	
	test('defaults', function() {
		store.defaults({ foo: 'bar' })
		assert(store.get('foo') == 'bar')
		store.set('foo', 'bar2')
		assert(store.get('foo') == 'bar2')
		store.remove('foo')
		assert(store.get('foo') == 'bar')
	})

	test('defaults + namespace', function() {
		store.defaults({ foo: 'bar' })
		var store2 = store.namespace('store2')
		var _ = store.namespace('store3')
		assert(store2.get('foo') == 'bar')
		store2.defaults({ foo: 'bar2' })
		assert(store2.get('foo') == 'bar2')
	})
}
