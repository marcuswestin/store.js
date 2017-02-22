var { Global, each, create, isList } = require('./util')

module.exports = {
	createStore: createStore
}

// API: these are the core Store.js  functions, and the
// only ones that interract with the underlying storage.
////////////////////////////////////////////////////////

var storeAPI = {
	// get returns the value of the given key. If that value
	// is undefined, it returns optionalDefaultValue instead.
	get: function(key, optionalDefaultValue) {
		var fixedKey = _fixKey(this, key)
		var data = this._storage.read(fixedKey)
		return _deserialize(data, optionalDefaultValue)
	},
	// set will store the given value at key and returns value.
	// Calling set with value === undefined is equivalent to calling remove.
	set: function(key, value) {
		if (value === undefined) {
			return this.remove(key)
		}
		var fixedKey = _fixKey(this, key)
		this._storage.write(fixedKey, _serialize(value))
		return value
	},
	// remove deletes the key and value stored at the given key.
	remove: function(key) {
		var fixedKey = _fixKey(this, key)
		this._storage.remove(fixedKey)
	},
	// each will call the given callback once for each key-value pair
	// in this store.
	each: function(callback) {
		var self = this
		this._storage.each(function(val, fixedKey) {
			var key = _unfixKey(self, fixedKey)
			callback(_deserialize(val), key)
		})
	},
	// clearAll will remove all the stored key-value pairs in this store.
	clearAll: function() {
		this._storage.clearAll()
	},

	// additional functionality that can't live in addons
	// --------------------------------------------------
	noConflict: function() {
		Global.store = _noConflictStoreVal
	},
	hasNamespace: function(namespace) {
		return (this._namespacePrefix == '__storejs_'+namespace+'_')
	},
	// namespace clones the current store and assigns it the given namespace
	namespace: function(namespace) {
		if (!_legalNamespace.test(namespace)) {
			throw new Error('store.js namespaces can only have alhpanumerics + underscores and dashes')
		}
		// create a prefix that is very unlikely to collide with un-namespaced keys
		var namespacePrefix = '__storejs_'+namespace+'_'
		return create(this, {
			_namespacePrefix: namespacePrefix,
			_namespaceRegexp: namespacePrefix ? new RegExp('^'+namespacePrefix) : null
		})
	}
}

// createStore creates a store.js instance with the first
// functioning storage in the list of storage candidates,
// and applies the the given mixins to the instance.
function createStore(storages, mixins) {
	var storage = _pickStorage(storages)
	var privateProps = {
		_storage: storage,
		_mixins: mixins,
		_namespacePrefix: '',
		_namespaceRegexp: null
	}
	var store = create(privateProps, storeAPI, {
		version: '2.0.0-rc1',
		enabled: !!storage,
		disabled: !storage
	})
	_applyMixins(mixins, store)
	return store
}

// Internal
///////////

var _legalNamespace = /^[a-zA-Z0-9_\-]+$/ // alpha-numeric + underscore and dash
var _ident = function(val) { return val }
var _noConflictStoreVal = Global.store

// Picking a functioning storage out of the list of candidates
// -----------------------------------------------------------

function _pickStorage(storages) {
	for (var i=0; i<storages.length; i++) {
		if (_testStorage(storages[i])) {
			return storages[i]
		}
	}
	return null
}

function _testStorage(storage) {
	try {
		var testStr = '__storejs__test__'
		storage.write(testStr, testStr)
		var ok = (storage.read(testStr) == testStr)
		storage.remove(testStr)
		return ok
	} catch(e) {
		return false
	}
}

// Functions to apply mixins to a store instance
// ---------------------------------------------

function _applyMixins(mixins, store) {
	var seenMixins = {}
	each(mixins, _addMixin)
	
	function _addMixin(mixinModule) {
		if (seenMixins[mixinModule.name]) {
			return
		}
		seenMixins[mixinModule.name] = true
		
		var newProps = mixinModule.mixin(store)
		each(newProps, function(mixinFn, propName) {
			if (typeof mixinFn != 'function') {
				throw new Error('Bad mixin value: '+propName+'. Mixins should only return functions.')
			}
			_assignMixinFn(store, propName, mixinFn)
		})
		
		if (mixinModule.dependencies && !isList(mixinModule.dependencies)) {
			throw new Error('mixin "'+mixinModule.name+'" dependencies should either be an array or undefined')
		}
		each(mixinModule.dependencies, function(dependencyMixin) {
			_addMixin(dependencyMixin)
		})
	}
}

function _assignMixinFn(store, propName, mixinFn) {
	var oldFn = store[propName]
	store[propName] = function mixedin() {
		var args = Array.prototype.slice.call(arguments, 0)
		var self = this
		
		// super_fn calls the old function which was overwritten by
		// this mixin.
		function super_fn() {
			if (!oldFn) { return }
			var result = oldFn.apply(self, super_fn.args)
			delete super_fn.args
			return result
		}

		// Give mixing function access to super_fn by prefixing all mixin function
		// arguments with super_fn.
		var newFnArgs = [super_fn].concat(args)
		// Allow the mixin function to access the super_fn arguments, so that it
		// can modify them if needed.
		super_fn.args = args
		
		return mixinFn.apply(self, newFnArgs)
	}
}

// Functions to fix and funfix keys. This is used by e.g 
// --------------------------------

function _fixKey(store, key) {
	var storageFixKeyFn = (store._storage.fixKey || _ident)
	return store._namespacePrefix + storageFixKeyFn(key)
}

function _unfixKey(store, key) {
	if (store._namespaceRegexp) {
		key = key.replace(store._namespaceRegexp, '')
	}
	var storageUnfixKeyFn = (store._storage.unfixKey || _ident)
	return storageUnfixKeyFn(key)
}

// Functions to serialize and deserialize stored values to and from strings
// ------------------------------------------------------------------------

function _serialize(obj) {
	return JSON.stringify(obj)
}

function _deserialize(strVal, defaultVal) {
	if (!strVal) { return defaultVal }
	var val = _safeDeserialize(strVal)
	return (val !== undefined ? val : defaultVal)
}

// It is possible that a raw string value has been previously stored
// givenin a storage without using store.js, meaning it will be a raw
// string value instead of a JSON serialized string. By defaulting
// to the raw string value in case of a JSON parse error, we allow
// for past stored values to be forwards-compatible with store.js
function _safeDeserialize(strVal) {
	try { return JSON.parse(strVal) }
	catch(e) { return strVal }
}

