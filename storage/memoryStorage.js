var { global, each } = require('../util')

module.exports = {
	name: 'memoryStorage',
	read: memoryStorage_read,
	write: memoryStorage_write,
	each: memoryStorage_each,
	remove: memoryStorage_remove,
	clearAll: memoryStorage_clearAll
}

var memoryStorage = {}

function memoryStorage_read(key) {
	return memoryStorage[key]
}

function memoryStorage_write(key, data) {
	memoryStorage[key] = data
}

function memoryStorage_each(callback) {
	each(memoryStorage, callback)
}

function memoryStorage_remove(key) {
	delete memoryStorage[key]
}

function memoryStorage_clearAll(key) {
	memoryStorage = {}
}
