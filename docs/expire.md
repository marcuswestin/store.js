# Expire Plugin

## Getting Started

First, include the plugin using `addPlugin`.

```javascript
var store = require('store');
var expirePlugin = require('store/plugins/expire');

store.addPlugin(expirePlugin);
```

Now, calls to `store.set` can accept a timestamp parameter. If a timestamp is used for a specified key, future `store.get` calls for that key will return the value if it is unexpired. Otherwise, it will return undefined.

For example:

```javascript
var STORE_KEY = 'expires';

// Note: The timestamp parameter is a full timestamp, not milliseconds
store.set(STORE_KEY, 'in 1 second', new Date.getTime() + 1000);

console.log(store.get(STORE_KEY)); // 'in 1 second'
setTimeout(function() {
  console.log(store.get(STORE_KEY)); // undefined
}, 1000);
```

## API

**getExpiration(key)** - Returns the expiration timestamp for the given key.

**removeExpiredKeys()** - Removes all unexpired keys.
