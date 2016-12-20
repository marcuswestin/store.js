var { global } = require('../util')

module.exports = {
	name: 'localStorage',
	read: localStorage_read,
	write: localStorage_write,
	each: localStorage_each,
	remove: localStorage_remove,
	clearAll: localStorage_clearAll
}

var localStorage = global.localStorage

function localStorage_read(key) {
	return localStorage.getItem(key)
}

function localStorage_write(key, data) {
	return localStorage.setItem(key, data)
}

function localStorage_each(fn) {
	for (var i = localStorage.length - 1; i >= 0; i--) {
		var key = localStorage.key(i)
		fn(localStorage_read(key), key)
	}
}

function localStorage_remove(key) {
	return localStorage.removeItem(key)
}

function localStorage_clearAll() {
	return localStorage.clear()
}
