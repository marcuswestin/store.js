store.js
========

store.js exposes a simple API for cross browser local storage

	// Store 'marcus' at 'username'
	store.set('username', 'marcus')
	
	// Get 'username'
	store.get('username')
	
	// Remove 'username'
	store.remove('username')
	
	// Clear all keys
	store.clear()
	
	// Store an object literal - store.js uses JSON.stringify under the hood
	store.set('user', { name: 'marcus', likes: 'javascript' })
	
	// Get the stored object - store.js uses JSON.parse under the hood
	var user = store.get('user')
	alert(user.name + ' likes ' + user.likes)

store.js depends on JSON for serialization.

How does it works?
------------------
store.js uses localStorage when available, and falls back on globalStorage for earlier versions of Firefox and the userData behavior in IE6 and IE7.
No flash to slow down your page load. No cookies to fatten your network requests.

Serialization
-------------
localStorage calls toString on all values that get stores. This means that you can't conveniently store and retrieve numbers, objects or arrays:

	localStorage.myage = 24
	localStorage.myage != 24
	localStorage.myage == '24'
	
	localStorage.user = { name: 'marcus', likes: 'javascript' }
	localStorage.user == "[object Object]"
	
	localStorage.tags = ['javascript', 'localStorage', 'store.js']
	localStorage.tags.length == 32
	localStorage.tags == "javascript,localStorage,store.js"

What we want (and get with store.js) is

	store.set('myage', 24)
	store.get('myage', 24) == 24
	
	store.set('user', { name: 'marcus', likes: 'javascript' })
	alert("Hi my name is " + store.get('user').name + "!")
	
	store.set('tags', ['javascript', 'localStorage', 'store.js'])
	alert("We've got " + store.get('tags').length + " tags here")

The native serialization engine of javascript is JSON. Rather than leaving it up to you to serialize and deserialize your values, store.js uses JSON.stringify() and JSON.parse() on each call to store.set() and store.get(), respectively.

Some browsers do not have native support for JSON. For those browsers you should include [JSON.js] (non-minified copy is included in this repo).

Tests
-----
Go to test.html in your browser

Supported browsers
------------------
 - Tested in Firefox 2.0
 - Tested in Firefox 3.0
 - Tested in Firefox 3.5
 - Tested in Firefox 3.6
 - Tested in Chrome 5
 - Tested in Safari 4
 - Tested in Safari 5
 - Tested in IE6
 - Tested in IE7
 - Tested in IE8
 - Tested in Opera 10
   - Opera 10.54

Supported but borken (please help fix)
--------------------------------------
 - Chrome 4
 - Opera 10.10

Unsuported browsers
-------------------
 - Firefox 1.0: no means (beside cookies and flash)
 - Safari 2: no means (beside cookies and flash)
 - Safari 3: no synchronous api (has asynch sqlite api, but store.js is synch)
 - Opera 9: don't know if there is synchronous api for storing data locally
 - Firefox 1.5: don't know if there is synchronous api for storing data locally

TODO
----
 - I believe underlying APIs can throw under certain conditions. Where do we need try/catch?
 - Test different versions of Opera 10.X explicitly


  [JSON.js]: http://www.json.org/json2.js