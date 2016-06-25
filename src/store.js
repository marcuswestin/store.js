"use strict"

module.exports = (function() {
	// Store.js
	var store = {},
		win = (typeof window != 'undefined' ? window : global),
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage
		

	// Ajax Request
	function request( method, url, query, data, done ) {

		query = query || {};
		method = method || 'POST';

		var requestApi = [
	        function() { return new XMLHttpRequest(); },
	        function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
	        function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
	    ],  xhr = false;

	    for( var i=0; i<3; i++ ) {
	    	try { requestApi[i](); } catch( e ){ continue; }
	    	xhr = requestApi[i]();
	    }

	    if ( xhr === false ) { 
	    	done('error', {
	    		code:500, 
	    		message:"can't create ajax object", 
	    		extra: {
	    			url:url, 
	    			query:query, 
	    			data:data, 
	    			done:done
	    		}
	    	}, null );
	    	return;
	    }

	    xhr.onreadystatechange = function() {
	    	if (xhr.readyState !== 4) return;
	    	if ( xhr.status === 200 ) {
		    	try {
		    		var data = JSON.parse( xhr.responseText );
		    	} catch( e ){
		    		done('error', { 
		    			code:500, 
		    			message:"can\'t parse data", 
		    			extra: { 
		    				url:url, 
		    				query:query, 
		    				data:data, 
		    				done:done, 
		    				resp:xhr.responseText
		    			}
		    		}, xhr);
		    		return;
		    	}

		    	if ( typeof data.code != 'undefined' && data.code != 0 ) {
		    		var message = data.message || 'Systemerror';
		    		done('error', data, xhr);
		    		return;
		    	}
		    	done('success', data, xhr);
		    }
	    }

	    // GET 参数
	    var queryArray = [], queryString = '';
	    for( var key in query ){
	    	queryArray.push(key + '=' + encodeURIComponent(query[key].toString()) );
	    }
	    queryString = queryArray.join('&');

	    if ( url.indexOf('?') != -1) {
	    	url = url + '&' + queryString;
	    } else {
	    	url = url + '?' + queryString;
	    }

	    // POST 参数
	    var pairs = [], dataString=null;
	    for(var name in data){
	        var value = data[name].toString();
	        // name = encodeURIComponent(name.replace('%20','+'));
	        /// value = encodeURIComponent(value.replace('%20','+'));
	        pairs.push(name+'='+encodeURIComponent(value));
	    }
	    dataString = pairs.join('&');

	    
	    xhr.open(method, url, true);
	    if ( method == "POST" ) {
			// xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded' );
		}

	    xhr.send(dataString);
	}


	store.disabled = false
	store.version = '1.3.20'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {
		var ret = {}
		store.forEach(function(key, val) {
			ret[key] = val
		})
		return ret
	}
	store.forEach = function() {}
	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	
	/**
	 * Push local data to remote server
	 * @param  string   api  remote server url
	 * @param  function done push complete callback function
	 * @param  string  namespace the namespace 
	 * @return null
	 */
	store.push = function ( api, done, namespace ) {
		namespace = namespace || '';
		var data = store.getAll();
		var json_text = JSON.stringify(data);
		try {
			request('POST', api, {}, { json:json_text, namespace:namespace }, done );
		} catch(e){ console.log('Request Error', api, data,  done) ;}
	}


	/**
	 * Pull data from remote server
	 * @param  string   api  remote server url
	 * @param  function done push complete callback function
	 * @param  string  namespace the namespace 
	 * @return null 
	 */
	store.pull = function( api, done, namespace) {
		namespace = namespace || '';
		var pullData = function( status, data, xhr ) {
			if ( status === 'error' ) {
				done(status, data, xhr );
				return;
			} else if ( status === 'success' ) {
				var errors = [];
				for( var key in data ) {
					try {
						store.set(key, data[key]); 
					} catch(e){
						errors.push({key:key, val:data[key]});
					}
				}

				if ( errors.length > 0 ) {

					data['extra'] = data['extra'] || {}
					data['extra']['fields'] = errors;
					done('error', data, xhr );
					return;
				}

				done( status, data, xhr );
			}
		}

		request('GET', api, {namespace:namespace}, {}, pullData );
	}


	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc && doc.documentElement.addBehavior) {
		var storageOwner,
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
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=attributes.length-1; i>=0; i--) {
				storage.removeAttribute(attributes[i].name)
			}
			storage.save(localStorageName)
		})
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled
	
	return store
}())
