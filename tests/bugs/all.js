test.group('bugs', function() {
	test('gh-235: Expire and Events plugins conflict with each other, results in RangeError: Maximum call stack size exceeded', function() {
		require('./gh-235')
	})
	test('gh-215', function() {
		require('./gh-215')
	})
})
