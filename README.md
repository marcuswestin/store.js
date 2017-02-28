Store.js
========

Table of Contents
-----------------

1. [Basic Usage](#basic-usage)
	- All you need to get started:
	- [API](#api)
	- [Using npm](#using-npm)
	- [Using a script tag](#using-a-script-tag)
2. [Supported Browsers](#supported-browsers)
	- All of them, pretty much:
	- [List of supported browsers](#list-of-supported-browsers)
3. [Builds](#builds)
	- Choose which build is right for you:
	- [List of default Builds](#list-of-default-builds)
	- [Make your own Build](#make-your-own-build)
4. [Plugins](#plugins)
	- Additional common functionality:
	- [List of all Plugins](#list-of-all-plugins)
	- [Using Plugins](#using-plugins)
	- [Write your own Plugin](#write-your-own-plugin)
5. [Storages](#storages)
	- Storages provide underlying persistance:
	- [List of all Storages](#list-of-all-storages)
	- [Write your own Storage](#write-your-own-storage)



Basic Usage
-----------

All you need to know to get started.

#### API

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

#### Using npm

```js
var store = require('store')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'
```

#### Using a script tag

First, download one of the #builds (e.g https://raw.githubusercontent.com/marcuswestin/store.js/master/dist/store.legacy.min.js). Then:

```html
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

#### List of supported browsers

- Tested on IE6+
- Tested on iOS 8+
- Tested on Android 4+
- Tested on Firefox 4+
- Tested on Chrome 27+
- Tested on Safari 5+
- Tested on Opera 11+
- Tested on Node (with https://github.com/coolaj86/node-localStorage)



Builds
------
Choose which build is right for you!

#### List of default builds

- [store.everything.min.js](dist/store.everything.min.js): All the plugins, all the storages. [Source](dist/store.everything.js)
- [store.legacy.min.js](dist/store.legacy.min.js): Full support for all tested browsers. Add plugins separately. [Source](dist/store.legacy.js)
- [store.modern.min.js](dist/store.modern.min.js): Full support for all modern browsers. Add plugins separately. [Source](dist/store.modern.js)
- [store.v1-backcompat.min.js](dist/store.dist/v1-backcompat.min.js): Full backwards compatability with [store.js v1](https://github.com/marcuswestin/store.js/releases/tag/v1.3.20). [Source](dist/store.v1-backcompat.js)

#### Make your own Build

If you're using NPM you can create your own build:

```js
var engine = require('../store-engine')
var storages = [require('store/storages/localStorage'), require('../../storages/cookieStorage')]
var plugins = [require('store/plugins/defaults'), require('store/plugins/expire')]
var store = engine.createStore(storages, plugins)
store.set('foo', 'bar', new Date().getTime() + 3000) // Using expire plugin to expire in 3 seconds
```



Plugins
-------

Plugins provide additional common functionality that some people need, but not everyone.

#### List of all Plugins

- [all.js](plugins/all.js):                      All the plugins in one handy place.
- [defaults.js](plugins/defaults.js):            Declare default values. [Example usage](plugins/defaults_test.js)
- [dump.js](plugins/dump.js):                    Dump all stored values. [Example usage](plugins/dump_test.js)
- [events.js](plugins/events.js):                Get notified when stored values change. [Example usage](plugins/events_test.js)
- [expire.js](plugins/expire.js):                Expire stored values after a given time. [Example usage](plugins/expire_test.js)
- [observe.js](plugins/observe.js):              Observe stored values and their changes. [Example usage](plugins/observe_test.js)
- [operations.js](plugins/operations.js):        Useful operations like push, shift & assign. [Example usage](plugins/operations_test.js)
- [update.js](plugins/update.js):                Update a stored object, or create it if null. [Example usage](plugins/update_test.js)
- [v1-backcompat.js](plugins/v1-backcompat.js):  Full backwards compatability with store.js v1. [Example usage](plugins/v1-backcompat_test.js)

#### Using Plugins

With npm:

```js
var expirePlugin = require('store/plugins/expire')
store.addPlugin(expirePlugin)
```

If you're using script tags, you can either use [store.everything.min.js](dist/store.everything.min.js) (which
has all plugins built-in), or clone this repo to add or modify a build and run `make build`.

#### Write your own plugin

A store.js plugin is a function that returns an object that gets added on to the store.
If any of the plugin functions overrides existing functions, the plugin function can still call
the original function using the first argument (super_fn).

I'll elaborate on this shortly (let me know if you need more info sooner rather than later!),
but for the moment I recommend you take a look at the [current plugins](plugins/). Good example
plugins are [plugins/defaults](plugins/defaults), [plugins/expire](plugins/expire) and
[plugins/events](plugins/events).


Storages
--------
Store.js will pick the best available storage, and automatically falls back to the first added storage that works.

#### List of all Storages

- [all.js](storages/all.js)                                     All the storages in one handy place.
- [cookieStorage.js](storages/cookieStorage.js)                 Store values in cookies. Useful for Safari Private mode.
- [localStorage.js](storages/localStorage.js)                   Store values in localStorage. Great for all modern browsers.
- [sessionStorage.js](storages/sessionStorage.js)               Store values in sessioStorage.
- [memoryStorage.js](storages/memoryStorage.js)                 Store values in memory. Great fallback to ensure store functionality at all times.
- [oldFF-globalStorage.js](storages/oldFF-globalStorage.js)     Store values in globalStorage. Only useful for legacy Firefox 3+.
- [oldIE-userDataStorage.js](storages/oldIE-userDataStorage.js) Store values in userData. Only useful for legacy IE 6+.


#### Write your own Storage

Chances are you won't ever need another storage. But if you do...

See [storages/](storages/) for examples. Two good examples are [memoryStorage](memoryStorage) and [localStorage](localStorage).

Basically, you just need an object that looks like this:

```js
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



