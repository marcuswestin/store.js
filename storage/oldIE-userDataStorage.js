
var { global } = require('../util')

module.exports = {
	name: 'userDataStorage-oldIE',
	fixKey: _makeIEKeyFixFn(),
	write: write,
	read: read,
	each: each,
	remove: remove,
	clearAll: clearAll
}

var storageName = 'oldIE'
var doc = global.document
var _withStorageEl = _makeIEStorageElFunction()

function write(key, data) {
	_withStorageEl(function(storageEl) {
		storageEl.setAttribute(key, data)
		storageEl.save(storageName)
	})
}

function read(key) {
	var res = null
	_withStorageEl(function(storageEl) {
		res = storageEl.getAttribute(key)
	})
	return res
}

function each(callback) {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		for (var i=attributes.length-1; i>=0; i--) {
			var attr = attributes[i]
			callback(attr.name, storageEl.getAttribute(attr.name))
		}		
	})
}

function remove(key) {
	_withStorageEl(function(storageEl) {
		storageEl.removeAttribute(key)
		storageEl.save(storageName)		
	})
}

function clearAll() {
	_withStorageEl(function(storageEl) {
		var attributes = storageEl.XMLDocument.documentElement.attributes
		storageEl.load(storageName)
		for (var i=attributes.length-1; i>=0; i--) {
			storageEl.removeAttribute(attributes[i].name)
		}
		storageEl.save(storageName)		
	})
}

// Helpers
//////////

function _makeIEKeyFixFn() {
	// In IE7, keys cannot start with a digit or contain certain chars.
	// See https://github.com/marcuswestin/store.js/issues/40
	// See https://github.com/marcuswestin/store.js/issues/83
	var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
	return function fixKey(key) {
		return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
	}
}

function _makeIEStorageElFunction() {
	if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
		return null
	}
	var scriptTag = 'script',
		storageOwner,
		storageContainer,
		storageEl
	
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
		/* global ActiveXObject */
		storageContainer = new ActiveXObject('htmlfile')
		storageContainer.open()
		storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
		storageContainer.close()
		storageOwner = storageContainer.w.frames[0].document
		storageEl = storageOwner.createElement('div')
	} catch(e) {
		// somehow ActiveXObject instantiation failed (perhaps some special
		// security settings or otherwse), fall back to per-path storage
		storageEl = doc.createElement('div')
		storageOwner = doc.body
	}
	
	return function(storeFunction) {
		var args = [].slice.call(arguments, 0)
		args.unshift(storageEl)
		// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
		// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
		storageOwner.appendChild(storageEl)
		storageEl.addBehavior('#default#userData')
		storageEl.load(storageName)
		storeFunction.apply(this, args)
		storageOwner.removeChild(storageEl)
		return
	}
}
