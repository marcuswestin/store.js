Store.js
========

1. [Version 2.0](#version-20)
	- What's new?
2. [Basic Usage](#basic-usage)
	- All you need to get started
	- [API](#api)
	- [Installation](#installation)
3. [Supported Browsers](#supported-browsers)
	- All of them, pretty much :)
	- [List of supported browsers](#list-of-supported-browsers)
4. [Plugins](#plugins)
	- Additional common functionality
	- [List of all Plugins](#list-of-all-plugins)
	- [Using Plugins](#using-plugins)
	- [Write your own Plugin](#write-your-own-plugin)
5. [Builds](#builds)
	- Choose which build is right for you
	- [List of default Builds](#list-of-default-builds)
	- [Make your own Build](#make-your-own-build)
6. [Storages](#storages)
	- Storages provide underlying persistance
	- [List of all Storages](#list-of-all-storages)
	- [Write your own Storage](#write-your-own-storage)


Version 2.0
-----------

Store.js has been around since 2010 ([first commit](https://github.com/marcuswestin/store.js/commit/cb0198c2c02ff5f17c084276eeb4f28c79849d5e)! [HN discussion](https://news.ycombinator.com/item?id=1468802)!), and is live on tens of thousands of websites - like cnn.com!

For many years v1.x provided basic cross-browser persistant storage, and over time more and more people [started asking](https://github.com/marcuswestin/store.js/issues?q=is%3Aissue+is%3Aclosed) for additional functionality.

Store.js version 2 is a full revamp with pluggable storage (it will automatically fall back to one that works in every scenario by default), pluggable extra functionality (like [expirations](plugins/expire.js), [default values](plugins/defaults.js), common [array/object operations](plugins/operations.js), etc), and fully cross-browser automatic testing using saucelabs.com.



Basic Usage
-----------

All you need to know to get started:

### API

store.js exposes a simple API for cross browser local storage:

```js
// Store current user
store.set('user', { name:'Marcus' })

// Get current user
store.get('user')

// Remove current user
store.remove('user')

// Clear all keys
store.clearAll()

// Loop over all stored values
store.each(function(value, key) {
	console.log(key, '==', value)
})
```

### Installation

Using npm:

```js
// Example store.js usage with npm
var store = require('store')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'
```

Using script tag: (First download one of the [builds](dist/))

```html
<!-- Example store.js usage with script tag -->
<script src="path/to/my/store.legacy.min.js"></script>
<script>
var store = require('store')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'
</script>
```



Supported Browsers
------------------

All of them, pretty much :)

To support all browsers (including IE6, IE7, Firefox 4, etc), use `require('store/dist/legacy')` or [store.legacy.min.js](dist/store.legacy.min.js).

To save some KBs but still support all modern browsers, use `require('store/dist/modern')` or [store.modern.min.js](dist/store.modern.min.js) instead.

### List of supported browsers

- Tested on IE6+
- Tested on iOS 8+
- Tested on Android 4+
- Tested on Firefox 4+
- Tested on Chrome 27+
- Tested on Safari 5+
- Tested on Opera 11+
- Tested on Node (with https://github.com/coolaj86/node-localStorage)




Plugins
-------

Plugins provide additional common functionality that some people need, but not everyone:

### List of all Plugins

- [all.js](plugins/all.js):                      All the plugins in one handy place.
- [defaults.js](plugins/defaults.js):            Declare default values. [Example usage](plugins/defaults_test.js)
- [dump.js](plugins/dump.js):                    Dump all stored values. [Example usage](plugins/dump_test.js)
- [events.js](plugins/events.js):                Get notified when stored values change. [Example usage](plugins/events_test.js)
- [expire.js](plugins/expire.js):                Expire stored values after a given time. [Example usage](plugins/expire_test.js)
- [observe.js](plugins/observe.js):              Observe stored values and their changes. [Example usage](plugins/observe_test.js)
- [operations.js](plugins/operations.js):        Useful operations like push, shift & assign. [Example usage](plugins/operations_test.js)
- [update.js](plugins/update.js):                Update a stored object, or create it if null. [Example usage](plugins/update_test.js)
- [v1-backcompat.js](plugins/v1-backcompat.js):  Full backwards compatability with store.js v1. [Example usage](plugins/v1-backcompat_test.js)

### Using Plugins

With npm:

```js
// Example plugin usage:
var expirePlugin = require('store/plugins/expire')
store.addPlugin(expirePlugin)
```

If you're using script tags, you can either use [store.everything.min.js](dist/store.everything.min.js) (which
has all plugins built-in), or clone this repo to add or modify a build and run `make build`.

### Write your own plugin

A store.js plugin is a function that returns an object that gets added on to the store.
If any of the plugin functions overrides existing functions, the plugin function can still call
the original function using the first argument (super_fn).

```js
// Example plugin that stores a version history of every value
var versionHistoryPlugin = function() {
	var historyStore = this.namespace('history')
	return {
		set: function(super_fn, key, value) {
			var history = historyStore.get(key) || []
			history.push(value)
			historyStore.set(key, history)
			return super_fn()
		},
		getHistory: function(key) {
			return historyStore.get(key)
		}
	}
}
store.addPlugin(versionHistoryPlugin)
store.set('foo', 'bar 1')
store.set('foo', 'bar 2')
store.getHistory('foo') == ['bar 1', 'bar 2']
```

Let me know if you need more info on writing plugins, but for the moment I recommend
taking a look at the [current plugins](plugins/). Good example plugins are
[plugins/defaults](plugins/defaults.js), [plugins/expire](plugins/expire.js) and
[plugins/events](plugins/events.js).



Builds
------

Choose which build is right for you!

### List of default builds

- [store.everything.min.js](dist/store.everything.min.js): All the plugins, all the storages. [Source](dist/store.everything.js)
- [store.legacy.min.js](dist/store.legacy.min.js): Full support for all tested browsers. Add plugins separately. [Source](dist/store.legacy.js)
- [store.modern.min.js](dist/store.modern.min.js): Full support for all modern browsers. Add plugins separately. [Source](dist/store.modern.js)
- [store.v1-backcompat.min.js](dist/store.v1-backcompat.min.js): Full backwards compatability with [store.js v1](https://github.com/marcuswestin/store.js/releases/tag/v1.3.20). [Source](dist/store.v1-backcompat.js)

### Make your own Build

If you're using NPM you can create your own build:

```js
// Example custom build usage:
var engine = require('../store-engine')
var storages = [
	require('store/storages/localStorage'),
	require('../../storages/cookieStorage')
]
var plugins = [
	require('store/plugins/defaults'),
	require('store/plugins/expire')
]
var store = engine.createStore(storages, plugins)
store.set('foo', 'bar', new Date().getTime() + 3000) // Using expire plugin to expire in 3 seconds
```




Storages
--------
Store.js will pick the best available storage, and automatically falls back to the first added storage that works:

### List of all Storages

- [all.js](storages/all.js)                                     All the storages in one handy place.
- [cookieStorage.js](storages/cookieStorage.js)                 Store values in cookies. Useful for Safari Private mode.
- [localStorage.js](storages/localStorage.js)                   Store values in localStorage. Great for all modern browsers.
- [sessionStorage.js](storages/sessionStorage.js)               Store values in sessioStorage.
- [memoryStorage.js](storages/memoryStorage.js)                 Store values in memory. Great fallback to ensure store functionality at all times.
- [oldFF-globalStorage.js](storages/oldFF-globalStorage.js)     Store values in globalStorage. Only useful for legacy Firefox 3+.
- [oldIE-userDataStorage.js](storages/oldIE-userDataStorage.js) Store values in userData. Only useful for legacy IE 6+.


### Write your own Storage

Chances are you won't ever need another storage. But if you do...

See [storages/](storages/) for examples. Two good examples are [memoryStorage](storages/memoryStorage.js) and [localStorage](storages/localStorage.js).

Basically, you just need an object that looks like this:

```js
// Example custom storage
var storage = {
	name: 'myStorage',
	read: function(key) { ... },
	write: function(key, value) { ... },
	each: function(fn) { ... },
	remove: function(key) { ... },
	clearAll: function() { ... }
}
store.addStorage(storage)
```



