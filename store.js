/* Copyright (c) 2010 Marcus Westin
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

var store = (function(){
	var api = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		storage;
	
	api.set = function(key, value) {};
	api.get = function(key) {};
	api.remove = function(key) {};
	api.clear = function() {};
	api.transact = function(key, transactionFn) {
		var val = api.get(key);
		if (typeof val == 'undefined') { val = {}; }
		transactionFn(val);
		api.set(key, val);
	};
	
	api.serialize = function(value) {
		return JSON.stringify(value);
	};
	api.deserialize = function(value) {
		if (typeof value != 'string') { return undefined; }
		return JSON.parse(value);
	};
	
	if (localStorageName in win && win[localStorageName]) {
		storage = win[localStorageName];
		api.set = function(key, val) { storage.setItem(key, api.serialize(val)); };
		api.get = function(key) { return api.deserialize(storage.getItem(key)); };
		api.remove = function(key) { storage.removeItem(key); };
		api.clear = function() { storage.clear(); };

	} else if (globalStorageName in win && win[globalStorageName]) {
		storage = win[globalStorageName][win.location.hostname];
		api.set = function(key, val) { storage[key] = api.serialize(val); };
		api.get = function(key) { return api.deserialize(storage[key] && storage[key].value); };
		api.remove = function(key) { delete storage[key]; };
		api.clear = function() { for (var key in storage ) { delete storage[key]; } };

	} else if (doc.documentElement.addBehavior) {
		storage = doc.createElement('div');
		function withIEStorage(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(storage);
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				doc.body.appendChild(storage);
				storage.addBehavior('#default#userData');
				storage.load(localStorageName);
				var result = storeFunction.apply(api, args);
				doc.body.removeChild(storage);
				return result;
			};
		}
		api.set = withIEStorage(function(storage, key, val) {
			storage.setAttribute(key, api.serialize(val));
			storage.save(localStorageName);
		});
		api.get = withIEStorage(function(storage, key) {
			return api.deserialize(storage.getAttribute(key));
		});
		api.remove = withIEStorage(function(storage, key) {
			storage.removeAttribute(key);
			storage.save(localStorageName);
		});
		api.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(localStorageName);
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name);
			}
			storage.save(localStorageName);
		});
	}

	return api;
})();
