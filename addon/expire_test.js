require('./expire')

module.exports = {
	setup: setup
}

function setup(store) {

	test('expire', function(done) {
		var duration = 50
		store.set('foo', 'bar', new Date().getTime() + duration)
		assert(store.get('foo') == 'bar')
		setTimeout(function() {
			assert(store.get('foo') == 'bar')
		}, 1)
		setTimeout(function() {
			assert(store.get('foo') == undefined)
			done()
		}, duration)
	})

}