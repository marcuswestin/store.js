var util = require('../src/util')
var Global = util.Global

module.exports = {
	name: 'localStorage',
	read,
	write,
	each,
	remove,
	clearAll,
}

function localStorage() {
	return Global.localStorage;
}

function read(key) {
	return localStorage().getItem(key);
}

function write(key, data) {
	return localStorage().setItem(key, data);
}

function each(fn) {
	for (var i = localStorage().length; i > 0; i--) {
		var key = localStorage().key(i)
		fn(read(key), key);
	}
}

function remove(key) {
	return localStorage().removeItem(key)
}

function clearAll() {
	return localStorage().clear()
}
