/* Copyright (c) 2010-2011 Marcus Westin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(root, store) {
	if (typeof module != 'undefined') { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { root.store = store }
})(this, (function(){
	var api = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		namespace = '__storejs__',
		storage

	api.disabled = false
	api.set = function(key, value) {}
	api.get = function(key) {}
	api.remove = function(key) {}
	api.clear = function() {}
	api.transact = function(key, transactionFn) {
		var val = api.get(key)
		if (typeof val == 'undefined') { val = {} }
		transactionFn(val)
		api.set(key, val)
	}

	api.serialize = function(value) {
		return JSON.stringify(value)
	}
	api.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		return JSON.parse(value)
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior 
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}
	
	function isGlobalStorageNameSupported() {
		try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
		catch(err) { return false }
	}	

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		api.set = function(key, val) { storage.setItem(key, api.serialize(val)) }
		api.get = function(key) { return api.deserialize(storage.getItem(key)) }
		api.remove = function(key) { storage.removeItem(key) }
		api.clear = function() { storage.clear() }

	} else if (isGlobalStorageNameSupported()) {
		storage = win[globalStorageName][win.location.hostname]
		api.set = function(key, val) { storage[key] = api.serialize(val) }
		api.get = function(key) { return api.deserialize(storage[key] && storage[key].value) }
		api.remove = function(key) { delete storage[key] }
		api.clear = function() { for (var key in storage ) { delete storage[key] } }

	} else if (doc.documentElement.addBehavior) {
		var storage,
			storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		function withIEStorage(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(api, args)
				storageOwner.removeChild(storage)
				return result
			}
		}
		api.set = withIEStorage(function(storage, key, val) {
			storage.setAttribute(key, api.serialize(val))
			storage.save(localStorageName)
		})
		api.get = withIEStorage(function(storage, key) {
			return api.deserialize(storage.getAttribute(key))
		})
		api.remove = withIEStorage(function(storage, key) {
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		api.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
	}
	
	try {
		api.set(namespace, namespace)
		if (api.get(namespace) != namespace) { api.disabled = true }
		api.remove(namespace)
	} catch(e) {
		api.disabled = true
	}
	
	return api
})());
