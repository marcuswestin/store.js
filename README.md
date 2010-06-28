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

 - Tested in Firefox 2.0
 - Tested in Firefox 3.0
 - Tested in Firefox 3.6
 - Tested in Chrome 5
 - Tested in Safari 4
 - Tested in Safari 5
 - Tested in IE6
 - Tested in IE7
 - Tested in IE8
 - Tested in Opera 10

TODO
----

 - I believe underlying APIs can throw under certain conditions. Where do we need try/catch?
 - Fix for Firefox 1.0 if possible (no localStorage or globalStorage)
 - Fix for Opera 9 if possible (no localStorage or globalStorage)
 - Test in Firefox 3.5
 - Test in Safari 2
 - Test in Safari 3
 - Test in Chrome 4
 - Test in Opera 9
