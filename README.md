store.js
========

store.js exposes a simple API for cross browser local store

	// Store 'marcus' at 'username'
	store.set('username', 'marcus')
	
	// Get 'username'
	store.get('username')
	
	// Delete 'username'
	store.del('username')
	
	// Clear all keys
	store.clear()
	
	// Use JSON to stash an object (see http://www.json.org/json2.js)
	store.set('user', JSON.stringify({ name: 'marcus', likes: 'javascript' }))
	
	// Use JSON to retrieve an object (see http://www.json.org/json2.js)
	var user = JSON.parse(store.get('user'))
	alert(user.name + ' likes ' + user.likes)

Tests
-----
Go to test.html in your browser.

So far tested in

 - Tested Firefox 3.6
 - Tested in Chrome 5
 - Tested in Safari 5
 - Tested in IE7

TODO
----
I wrote store.js in the past hour looking at https://developer.mozilla.org/en/dom/store and http://msdn.microsoft.com/en-us/library/ms531424.aspx. I haven't tested it yet though.

 - I believe underlying APIs can throw under certain conditions. Where do we need try/catch?
 - Test in IE6
 - Test in IE8
 - Test in Firefox 2.0
 - Test in Firefox 3.0
 - Test in Firefox 3.5
 - Test in Safari 2
 - Test in Safari 3
 - Test in Safari 4
 - Test in Chrome 4
 - Test in Opera 9
 - Test in Opera 10
