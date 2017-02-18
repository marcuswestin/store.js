require('./expire')

module.exports = {
	setup: setup
}

function setup(store) {

	test('expire', function(done) {
		var duration = 30
		store.set('foo', 'bar', new Date().getTime() + duration)
		assert(store.get('foo') == 'bar')
		setTimeout(function() {
			assert(store.get('foo') == 'bar')
		}, duration/2)
		setTimeout(function() {
			assert(store.get('foo') == undefined)
			store.set('foo', 'bar')
			setTimeout(function() {
				assert(store.get('foo') == 'bar')
				done()
			}, 5)
		}, duration)
		
	})

}
