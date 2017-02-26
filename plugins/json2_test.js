require('./json2')

module.exports = {
	setup: setup,
}

function setup(store) {
	
	test('serialization with json2', function() {
		store.set('foo', { bar:'cat' })
		assert(store.get('foo').bar === 'cat')
	})
}
