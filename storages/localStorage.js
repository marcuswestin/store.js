var { Global } = require('../src/util')

module.exports = {
	name: 'localStorage',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll,
}

var localStorage = Global.localStorage

function read(key) {
	return localStorage.getItem(key)
}

function write(key, data) {
	return localStorage.setItem(key, data)
}

function each(fn) {
	for (var i = localStorage.length - 1; i >= 0; i--) {
		var key = localStorage.key(i)
		fn(read(key), key)
	}
}

function remove(key) {
	return localStorage.removeItem(key)
}

function clearAll() {
	return localStorage.clear()
}
