// Useful for e.g safari private browser mode, where localStorage doesn't work but cookies do.
// Implementation adopted from https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

var { global, trim } = require('../util')

module.exports = {
	name: 'cookieStorage',
	read: cookies_read,
	write: cookies_write,
	each: cookies_each,
	remove: cookies_remove,
	clearAll: cookies_clearAll		
}

var doc = global.document

function cookies_read(key) {
	if (!key || !_has(key)) { return null }
	var regexpStr = "(?:^|.*;\\s*)" + 
		escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
		"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
	return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
}	

function cookies_each(callback) {
	var cookies = doc.cookie.split(';')
	for (var i = cookies.length; i >= 0; i--) {
		var kvp = cookies[i].split('=')
		callback(trim(kvp[0]), trim([kvp[1]]))
	}
}

function cookies_write(key, data) {
	if(!key) { return }
	doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
}

function cookies_remove(key) {
	if (!key || !_has(key)) {
		return
	}
	doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
}

function cookies_clearAll() {
	cookies_each(function(_, key) {
		cookies_remove(key)
	})
}

function _has(key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
}
