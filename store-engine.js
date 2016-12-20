var { trim, warn, bind, assign, each, create, slice } = require('./util')

var global = function(){ return this }()

module.exports = {
	// global: global,
	createStore: createStore
}

// Internal
///////////
var _matchNothingRegexp = /$.^/ // matches nothing ever
var _legalNamespace = /^[a-zA-Z0-9_\-]+$/ // alpha-numeric + underscore and dash

function _ident(val) {
	return val
}

var noConflictStoreVal = global.store

function createStore(storages, mixins) {
	var storage = _pickStorage(storages)
	var privateProps = {
		_storage: storage,
		_mixins: mixins,
		_namespacePrefix: '',
		_namespaceRegexp: null
	}
	var store = create(privateProps, storeAPI, {
		enabled: !!storage,
		disabled: !storage
	})
	_applyMixins(mixins, store)
	return store
}

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

function _applyMixins(mixins, store) {
	each(mixins, function(mixinModule) {
		var newProps = mixinModule.mixin(store)
		each(newProps, function(mixinFn, propName) {
			if (typeof mixinFn != 'function') {
				throw new Error('Bad mixin value: '+propName+'. Mixins should only return functions.')
			}
			_assignMixinFn(store, propName, mixinFn)
		})
	})
}

function _assignMixinFn(store, propName, mixinFn) {
	var oldFn = store[propName]
	store[propName] = function mixedin() {
		var args = slice(arguments, 0)
		
		// super_fn calls the old function which was overwritten by
		// this mixin.
		function super_fn() {
			if (!oldFn) { return }
			var result = oldFn.apply(store, super_fn.args)
			delete super_fn.args
			return result
		}

		// Give mixing function access to super_fn by prefixing all mixin function
		// arguments with super_fn.
		var newFnArgs = [super_fn].concat(args)
		// Allow the mixin function to access the super_fn arguments, so that it
		// can modify them if needed.
		super_fn.args = args
		
		return mixinFn.apply(store, newFnArgs)
	}
}

var storeAPI = {
	enabled: false,
	disabled: true,
	
	// namespace clones the current store and assigns it the given namespace
	namespace: function(namespace) {
		if (!_legalNamespace.test(namespace)) {
			throw new Error('store.js namespaces can only have alhpanumerics + underscores and dashes')
		}
		// create a prefix that will almost certainly not collide with
		// un-namespaced keys
		var namespacePrefix = '__storejs_'+namespace+'_'
		return create(this, {
			_namespacePrefix: namespacePrefix,
			_namespaceRegexp: namespacePrefix ? new RegExp('^'+namespacePrefix) : null
		})
	},
	// Core functions. These are the only to
	// interract directly with the storage.
	////////////////////////////////////////
	get: function(key, optDefaultVal) {
		key = this._fixKey(key)
		return serializer.deserialize(this._storage.read(key), optDefaultVal)
	},
	set: function(key, val) {
		if (val === undefined) {
			this.remove(key)
			return
		}
		key = this._fixKey(key)
		this._storage.write(key, serializer.serialize(val))
		return val
	},
	remove: function(key) {
		key = this._fixKey(key)
		this._storage.remove(key)
	},
	each: function(callback) {
		var _unfixKey = bind(this, this._unfixKey)
		this._storage.each(function(val, key) {
			callback(serializer.deserialize(val), _unfixKey(key))
		})
	},
	clearAll: function() {
		this._storage.clearAll()
	},
	_fixKey: function(key) {
		var storageFixKeyFn = (this._storage.fixKey || _ident)
		return this._namespacePrefix + storageFixKeyFn(key)
	},
	_unfixKey: function(key) {
		if (this._namespaceRegexp) {
			key = key.replace(this._namespaceRegexp, '')
		}
		var storageUnfixKeyFn = (this._storage.unfixKey || _ident)
		return storageUnfixKeyFn(key)
	},

	// Misc additional functions
	////////////////////////////
	noConflict: function() {
		global.store = noConflictStoreVal
	},
	has: function(key) {
		return this.get(key) !== undefined
	},
	dump: function() {
		var res = {}
		this.each(function(val, key) {
			res[key] = val
		})
		return res
	}
}

var serializer = {
	deserialize: function(strVal, defaultVal) {
		if (!strVal) { return defaultVal }
		var val = this._safeDeserialize(strVal)
		return (val !== undefined ? val : defaultVal)
	},
	serialize: function(obj) {
		return JSON.stringify(obj)
	},
	// It is possible that a raw string value has been stored in the
	// given storage without using store.js, meaning it will be a raw
	// string value instead of a JSON serialized string. By defaulting
	// to the raw string value in case of a JSON parse error, we allow
	// for past stored values to be forwards-compatible with store.js
	_safeDeserialize: function(strVal) {
		try { return JSON.parse(strVal) }
		catch(e) { return strVal }
	}
}
