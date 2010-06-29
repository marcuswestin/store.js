var store = (function(){
	var api = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		globalStorageName = 'globalStorage',
		storage
	
	api.set = function(key, value) {}
	api.get = function(key) {}
	api.remove = function(key) {}
	api.clear = function() {}
	
	if (localStorageName in win && win[localStorageName]) {
		storage = win[localStorageName]
		api.set = function(key, val) { storage[key] = val }
		api.get = function(key) { return storage[key] }
		api.remove = function(key) { delete storage[key] }
		api.clear = function() { storage.clear() }
	} else if (globalStorageName in win && win[globalStorageName]) {
		storage = win[globalStorageName][win.location.hostname]
		api.set = function(key, val) { storage[key] = val }
		api.get = function(key) { return storage[key] && storage[key].value }
		api.remove = function(key) { delete storage[key] }
		api.clear = function() { for (var key in storage ) { delete storage[key] } }
	} else if (doc.documentElement.addBehavior) {
		function createStorage() {
			storage = doc.body.appendChild(doc.createElement('div'))
			storage.style.display = 'none'
			// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
			// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
			storage.addBehavior('#default#userData') 
			storage.load(name)
		}
		api.set = function(key, val) {
			if (!storage) { createStorage() }
			storage.setAttribute(key, val)
			storage.save(name)
		}
		api.get = function(key) {
			if (!storage) { createStorage() }
			return storage.getAttribute(key)
		}
		api.remove = function(key) {
			if (!storage) { createStorage() }
			storage.removeAttribute(key)
			storage.save(name)
		}
		api.clear = function() {
			if (!storage) { createStorage() }
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(name)
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(name)
		}
	}
	
	return api
})()
