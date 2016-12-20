
var { global } = require('../util')

module.exports = {
	name: 'globalStorage-oldFF',
	read: globalStorage_read,
	write: globalStorage_write,
	each: globalStorage_each,
	remove: globalStorage_remove,
	clearAll: globalStorage_clearAll
}

var globalStorage = global.globalStorage

function globalStorage_read(key) {
	return globalStorage[key]
}

function globalStorage_write(key, data) {
	globalStorage[key] = data
}

function globalStorage_each(fn) {
	for (var i = globalStorage.length - 1; i >= 0; i--) {
		var key = globalStorage.key(i)
		callback(key, globalStorage[key])
	}
}

function globalStorage_remove(key) {
	return globalStorage.removeItem(key)
}

function globalStorage_clearAll() {
	globalStorage_each(function(key, _) {
		delete globalStorage[key]
	})
}
