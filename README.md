store.js
========

store.js exposes a simple API for cross browser local storage

```js
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

// Get all stored values
store.getAll().user.name == 'marcus'
```

store.js depends on JSON for serialization.

How does it work?
------------------
store.js uses localStorage when available, and falls back on the userData behavior in IE6 and IE7. No flash to slow down your page load. No cookies to fatten your network requests.

Screencast
-----------
[Introductory Screencast to Store.js](http://javascriptplayground.com/blog/2012/06/javascript-local-storage-store-js-tutorial) by Jack Franklin.


`store.enabled` - check that localStorage is available
-------------------------------------------------------
To check that persistance is available, you can use the `store.enabled` flag:

```js
if( store.enabled ) {
	console.log("localStorage is available");
} else {
	//time to fallback
}
```

Please note that `store.disabled` does exist but is deprecated in favour of `store.enabled`.

There are conditions where localStorage may appear to be available but will throw an error when used. For example, Safari's private browsing mode does this, and some browser allow the user to temporarily disable localStorage. Store.js detects these conditions and sets the `store.enabled` flag accordingly.



Serialization
-------------
localStorage, when used without store.js, calls toString on all stored values. This means that you can't conveniently store and retrieve numbers, objects or arrays:

```js
localStorage.myage = 24
localStorage.myage !== 24
localStorage.myage === '24'

localStorage.user = { name: 'marcus', likes: 'javascript' }
localStorage.user === "[object Object]"

localStorage.tags = ['javascript', 'localStorage', 'store.js']
localStorage.tags.length === 32
localStorage.tags === "javascript,localStorage,store.js"
```

What we want (and get with store.js) is

```js
store.set('myage', 24)
store.get('myage') === 24

store.set('user', { name: 'marcus', likes: 'javascript' })
alert("Hi my name is " + store.get('user').name + "!")

store.set('tags', ['javascript', 'localStorage', 'store.js'])
alert("We've got " + store.get('tags').length + " tags here")
```

The native serialization engine of javascript is JSON. Rather than leaving it up to you to serialize and deserialize your values, store.js uses JSON.stringify() and JSON.parse() on each call to store.set() and store.get(), respectively.

Some browsers do not have native support for JSON. For those browsers you should include [JSON.js](non-minified copy is included in this repo).

No sessionStorage/auto-expiration?
----------------------------------
No. I believe there is no way to provide sessionStorage semantics cross browser. However, it is trivial to expire values on read on top of store.js:

```js
var storeWithExpiration = {
	set: function(key, val, exp) {
		store.set(key, { val:val, exp:exp, time:new Date().getTime() })
	},
	get: function(key) {
		var info = store.get(key)
		if (!info) { return null }
		if (new Date().getTime() - info.time > info.exp) { return null }
		return info.val
	}
}
storeWithExpiration.set('foo', 'bar', 1000)
setTimeout(function() { console.log(storeWithExpiration.get('foo')) }, 500) // -> "bar"
setTimeout(function() { console.log(storeWithExpiration.get('foo')) }, 1500) // -> null
```

Node.js
-------
store.js works as expected in node.js, assuming that global.localStorage has been set:

```
global.localStorage = require('localStorage')
var store = require('./store')
store.set('foo', 1)
console.log(store.get('foo'))
```

Run tests
---------
For a browser: Go to http://marcuswestin.github.io/store.js/test.html to test the latest version of store.js.

For a browser, locally: do `npm install node-static && ./node_modules/node-static/bin/cli.js` and go to http://localhost:8080

(Note that test.html must be served over http:// or https://. This is because localStore does not work in some browsers when using the file:// protocol.)

For Nodejs: do `npm install . localStorage && node test-node.js`

Supported browsers
------------------
 - Tested in iOS 4
 - Tested in iOS 5
 - Tested in iOS 6
 - Tested in Firefox 3.5
 - Tested in Firefox 3.6
 - Tested in Firefox 4.0+
 - Support dropped for Firefox < 3.5 (see notes below)
 - Tested in Chrome 5
 - Tested in Chrome 6
 - Tested in Chrome 7
 - Tested in Chrome 8
 - Tested in Chrome 10
 - Tested in Chrome 11+
 - Tested in Safari 4
 - Tested in Safari 5
 - Tested in IE6
 - Tested in IE7
 - Tested in IE8
 - Tested in IE9
 - Tested in IE10
 - Tested in Opera 10
 - Tested in Opera 11
 - Tested in Opera 12
 - Tested in Node.js v0.10.4 (with https://github.com/coolaj86/node-localStorage 1.0.2)

*Saucelabs.com rocks* Extensive browser testing of store.js is possible thanks to Saucelabs.com. Check them out, they're awesome.

*Firefox 3.0 & 2.0:* Support for FF 2 & 3 was dropped in v1.3.6. If you require support for ancient versions of FF, use v1.3.5 of store.js.

*Important note:* In IE6 and IE7, many special characters are not allowed in the keys used to store any key/value pair. With [@mferretti](https://github.com/mferretti)'s help, there's a suitable workaround which replaces most forbidden characters with "___".

Storage limits
--------------
 - IE6 & IE7: 1MB total, but 128kb per "path" or "document" (see http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx)
 - See http://dev-test.nemikor.com/web-storage/support-test/ for a list of limits per browser

Unsupported browsers
-------------------
 - Firefox 1.0: no means (beside cookies and flash)
 - Safari 2: no means (beside cookies and flash)
 - Safari 3: no synchronous api (has asynch sqlite api, but store.js is synch)
 - Opera 9: don't know if there is synchronous api for storing data locally
 - Firefox 1.5: don't know if there is synchronous api for storing data locally

Forks
----
 - Original: https://github.com/marcuswestin/store.js
 - Sans JSON support (simple key/values only): https://github.com/cloudhead/store.js
 - jQueryfied version: https://github.com/whitmer/store.js 
 - Lint.js passing version (with semi-colons): https://github.com/StevenBlack/store.js
 
  [JSON.js]: http://www.json.org/json2.js

Contributors
------------
 - [@marcuswestin](https://github.com/marcuswestin) Marcus Westin (Author)
 - [@mjpizz](https://github.com/mjpizz) Matt Pizzimenti
 - [@StevenBlack](https://github.com/StevenBlack) Steven Black
 - [@ryankirkman](https://github.com/ryankirkman) Ryan Kirkman
 - [@pereckerdal](https://github.com/pereckerdal) Per Eckerdal
 - [@manuelvanrijn](https://github.com/manuelvanrijn) Manuel van Rijn
 - [@StuPig](https://github.com/StuPig) Shou Qiang
 - [@blq](https://github.com/blq) Fredrik Blomqvist
 - [@tjarratt](https://github.com/tjarratt) Tim Jarratt
 - [@gregwebs](https://github.com/gregwebs) Greg Weber
 - [@jackfranklin](https://github.com/jackfranklin) Jack Franklin
 - [@pauldwaite](https://github.com/pauldwaite) Paul D. Waite
 - [@mferretti](https://github.com/mferretti) Marco Ferretti
 - [@whitehat101](https://github.com/whitehat101) Jeremy Ebler
 - [@lepture](https://github.com/lepture) Hsiaoming Yang
 - [@lovejs](https://github.com/lovejs) Ruslan G
 - [@rmg](https://github.com/rmg) Ryan Graham
 - [@MatthewMueller](https://github.com/MatthewMueller) Matthew Mueller
 - [@robinator](https://github.com/robinator) Rob Law
