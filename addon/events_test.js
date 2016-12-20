require('./events')

module.exports = {
	setup: setup
}

function setup(store) {
	
	test('events', function() {
		store.set('foo', 'bar')
		
		var expectationNone = _createExpectation('expectNone')
		var expectation1 = _createExpectation('foo')
		var expect = []
		var count = 0
		
		store.watch('foo', function(){})
		var watchId = store.watch('foo', function(val, oldVal) {
			count += 1
			assert(val == expect[count])
			assert(oldVal, expect[count - 1])
		})
		store.watch('foo', function(){})
		
		expectation1.add('bar2')
		store.set('foo', 'bar2')
		
		expectation1.add(undefined)
		store.remove('foo')
		
		expectation1.add('bar3')
		store.set('foo', 'bar3')
		
		var expectation2 = _createExpectation('foo')
		expectation1.add(undefined)
		expectation2.add(undefined)
		store.clearAll()
		
		expectation1.unwatch(watchId)
		expectation2.add('bar4')
		store.set('foo', 'bar4')
		
		expectation1.check()
		expectation2.check()
		expectationNone.check()
	})

	function _createExpectation(key) {
		var expectation = {
			values: [],
			count: 0,
			add: function(value) {
				this.values.push(value)
			},
			check: function() {
				assert(expectation.count == expectation.values.length)
			},
			unwatch: function() {
				store.unwatch(watchId)
			}
		}
		
		var watchId = store.watch(key, function(val, oldVal) {
			expectation.count += 1
			assert(expectation.values[expectation.count] == val)
			assert(expectation.values[expectation.count - 1] == oldVal)
		})
		
		return expectation
	}
	
}