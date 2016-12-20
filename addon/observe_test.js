require('./observe')

module.exports = {
	setup: setup
}

function setup(store) {

	test('observe', function() {
		var count = 0
		var expect = [undefined]
		var obsId = store.observe('foo', function(val, oldVal) {
			count += 1
			assert(expect[count] == val)
			assert(expect[count - 1] == oldVal)
		}) // count == 1
		store.unwatch(obsId)
		
		expect.push('bar')
		store.set('foo', 'bar')	
		var obsId = store.observe('foo', function(val, oldVal) {
			count += 1
			assert(expect[count] == val)
			assert(expect[count - 1] == oldVal)
		}) // count == 2
		
		expect.push('bar2')
		store.set('foo', 'bar2') // count == 3
		assert(count == expect.length)
	})

}