test.group('bugs', function() {
	test('gh-235: Expire and Events plugins conflict with each other', function() {
		require('./gh-235.js')
	})
})
