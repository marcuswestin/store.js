test.group('bugs', function() {
	test("gh-215: Expire plugin doesn't factor custom namespaces", function() {
		require('./gh-215')
	})
	test("gh-235: Expire and Events plugins conflict with each other", function() {
		require('./gh-235')
	})
	test("gh-236", function() {
		require('./gh-236')
	})
})
