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

}
