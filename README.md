Store.js
========

Table of Contents
-----------------

1. [Basic Usage](#basic-usage): All you need to know to get started.
	- [Using a script tag](#using-a-script-tag)
	- [Using NPM](#using-npm)
	- [API](#api)
2. [Supported Browsers](#supported-browsers): All of them, pretty much :)
3. [Builds](#builds): Choose which build is right for you.
	- [store.everything.js](#store.everything.js)
	- [store.legacy.js](#store.legacy.js)
	- [store.modern.js](#store.modern.js)
	- [store.tests.js](#store.tests.js)
	- [store.v1-backcompat.js](#store.v1-backcompat.js)
	- [Make your own Build](#make-your-own-build)
4. [Plugins](#plugins): For additional common functionality.
	- [all.js](#all.js)
	- [defaults.js](#defaults.js)
	- [dump.js](#dump.js)
	- [events.js](#events.js)
	- [expire.js](#expire.js)
	- [json2.js](#json2.js)
	- [observe.js](#observe.js)
	- [operations.js](#operations.js)
	- [update.js](#update.js)
	- [v1-backcompat.js](#v1-backcompat.js)
	- [Write your own Plugin][#write-your-own-plugin]
5. [Storages](#storages): A list of all Storages.
	- [all.js](#all.js)
	- [cookieStorage.js](#cookiestorage.js)
	- [localStorage.js](#localstorage.js)
	- [memoryStorage.js](#memorystorage.js)
	- [oldFF-globalStorage.js](#oldff-globalstorage.js)
	- [oldIE-userDataStorage.js](#oldie-userdatastorage.js)
	- [sessionStorage.js](#sessionstorage.js)
	- [Write your own Storage](#write-your-own-storage)


Basic Usage
-----------
All you need to know to get started.

#### Using a script tag](#using-a-script-tag)

First, download one of the #builds (e.g https://raw.githubusercontent.com/marcuswestin/store.js/master/dist/store.legacy.min.js). Then:

```html
<script src="path/to/my/store.legacy.min.js"></script>
<script>
var store = require('store')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'
</script>
```

#### Using NPM

```js
var store = require('store')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'
```


#### API

store.js exposes a simple API for cross browser local storage:

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

// Loop over all stored values
store.each(function(value, key) {
	console.log(key, '==', value)
})
```


Supported Browsers
------------------
All of them, pretty much :)

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
Choose which build is right for you.

#### store.everything.js
#### store.legacy.js
#### store.modern.js
#### store.tests.js
#### store.v1-backcompat.js
#### Make your own Build


Plugins
-------
For additional common functionality.

#### all.js
#### defaults.js
#### dump.js
#### events.js
#### expire.js
#### json2.js
#### observe.js
#### operations.js
#### update.js
#### v1-backcompat.js


Storages
--------
A list of all Storages.

#### all.js
#### cookieStorage.js
#### localStorage.js
#### memoryStorage.js
#### oldFF-globalStorage.js
#### oldIE-userDataStorage.js
#### sessionStorage.js
#### Write your own Storage

