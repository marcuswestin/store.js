
var { global } = require('../util')

module.exports = {
	name: 'sessionStorage',
	read: sessionStorage_read,
	write: sessionStorage_write,
	each: sessionStorage_each,
	remove: sessionStorage_remove,
	clearAll: sessionStorage_clearAll
}

var sessionStorage = global.sessionStorage

function sessionStorage_read(key) {
	return sessionStorage.getItem(key)
}

function sessionStorage_write(key, data) {
	return sessionStorage.setItem(key, data)
}

function sessionStorage_each(fn) {
	for (var i = sessionStorage.length - 1; i >= 0; i--) {
		callback(sessionStorage.key(i), sessionStorage_read(key))
	}
}

function sessionStorage_remove(key) {
	return sessionStorage.removeItem(key)
}

function sessionStorage_clearAll() {
	return sessionStorage.clear()
}
