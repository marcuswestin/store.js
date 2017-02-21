require('./expire')

module.exports = {
	setup: setup
}

function setup(store) {

	test('expire', function(done) {
		var duration = 20
		var expiration = new Date().getTime() + duration
		store.set('foo', 'bar', expiration)			
		assert(store.get('foo') == 'bar')
		setTimeout(function() {
			assert(new Date().getTime() < expiration)
			assert(store.get('foo') == 'bar')
			setTimeout(function() {
				assert(new Date().getTime() > expiration)
				assert(store.get('foo') == undefined)
				store.set('foo', 'bar')
				setTimeout(function() {
					assert(store.get('foo') == 'bar')
					done()
				}, 5)
			}, duration)
		}, duration/2)
	})
}
