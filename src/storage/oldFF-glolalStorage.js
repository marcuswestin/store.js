
var { global } = require('../util')

module.exports = {
	name: 'globalStorage-oldFF',
	read: read,
	write: write,
	each: each,
	remove: remove,
	clearAll: clearAll
}

var globalStorage = global.globalStorage

function read(key) {
	return globalStorage[key]
}

function write(key, data) {
	globalStorage[key] = data
}

function each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		fn(key, globalStorage[key])
	}
}

function remove(key) {
	return globalStorage.removeItem(key)
}

function clearAll() {
	each(function(key, _) {
		delete globalStorage[key]
	})
}
