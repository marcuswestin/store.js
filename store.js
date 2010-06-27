var store = (function(){
	var api = {},
		win = window,
		doc = win.document,
		name = 'localStorage',
		storage
	
	api.set = function(key, value) {}
	api.get = function(key) {}
	api.delete = function(key) {}
	api.clear = function() {}
	
	if (win.localStorage) {
		storage = win.localStorage
		api.set = function(key, val) { storage[key] = val }
		api.get = function(key) { return storage[key] }
		api.delete = function(key) { delete storage[key] }
		api.clear = function() { storage.clear() }
	} else if (win.globalStorage) {
		storage = win.globalStorage[win.location.hostname]
		api.set = function(key, val) { storage[key] = val }
		api.get = function(key) { return storage[key] && storage[key].value }
		api.delete = function(key) { delete storage[key] }
		api.clear = function() { for (var key in storage ) { delete storage[key] } }
	} else if (Element.prototype.addBehavior) {
		storage = doc.body.appendChild(doc.createElement('div'))
		storage.style.display = 'none'
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storage.addBehavior('#default#userData') 
		storage.load(name)
		api.set = function(key, val) {
			storage.setAttribute(key, val)
			storage.save(name)
		}
		api.get = function(key) {
			return storage.getAttribute(key)
		}
		api.delete = function(key) {
			storage.removeAttribute(key)
			storage.save(name)
		}
		api.clear = function() {
			var attributes = storage.XMLDocument.documentElement.attributes;
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(name)
		}
	}
	
	return api
})()
