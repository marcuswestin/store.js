require('./compression')
var util = require('../tests/util')

module.exports = {
	setup: setup,
}

function setup(store) {

	test('compression', function() {
		store.compress('foo', 'baz')
		assert(store.get('foo') == 'ᄂゆ׬䀀', 'value should be lz compressed')
		assert(store.decompress('foo') == 'baz', 'value should be baz')
		var obj = { one: { two: 3 }}
		store.compress('foo', obj)
		assert(store.get('foo') == '㞂⃶ݠ꘠岠ᜃ릎٠⾆耀', 'object should be lz compressed')
		assert(util.deepEqual(store.decompress('foo'), obj), 'should deep equal original object')
		store.remove('foo')
	})

	test('compression clobbers existing values', function () {
		store.set('foo', 'bar')
		assert(store.get('foo') == 'bar', 'value should be bar')
		store.compress('foo', 'baz')
		assert(store.decompress('foo') == 'baz', 'new value should be baz')
		store.remove('foo')
	})

	test('decompressing non-existing data', function () {
		assert(store.decompress('bar') == undefined, 'value should be undefined')
		store.remove('bar')
	})

}
