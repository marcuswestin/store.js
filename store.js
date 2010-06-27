var store = (function(){
	var api = {},
		win = window,
		doc = win.document,
		name = 'localStorage',
		store
	
	api.set = function(key, value) {}
	api.get = function(key) {}
	api.delete = function(key) {}
	api.clear = function() {}
	
	if (win.globalStorage) {
		store = win.globalStorage[win.location.hostname]
		api.set = function(key, val) { store[key] = val }
		api.get = function(key) { return store[key].value }
		api.delete = function(key) { delete store[key] }
		api.clear = function() { for (var key in store ) { delete store[key] } }
	} else if (win.localStorage) {
		store = win.localStorage
		api.set = function(key, val) { store[key] = val }
		api.get = function(key) { return store[key] }
		api.delete = function(key) { delete store[key] }
		api.clear = function() { for (var key in store ) { delete store[key] } }
	} else if (Element.prototype.addBehavior) {
		store = doc.body.appendChild(doc.createElement('div'))
		store.style.display = 'none'
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		store.addBehavior('#default#userData') 
		store.load(name)
		api.set = function(key, val) {
			store.setAttribute(key, val)
			store.save(name)
		}
		api.get = function(key) {
			return store.getAttribute(key)
		}
		api.delete = function(key) {
			store.removeAttribute(key)
			store.save(name)
		}
		api.clear = function() {
			var attributes = store.XMLDocument.documentElement.attributes;
			for (var i=0, attr; attr = attributes[i]; i++) {
				store.removeAttribute(attr.name)
			}
			store.save(name)
		}
	}
	
	return api
})();
