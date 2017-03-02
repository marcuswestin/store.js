require('./compression')
var util = require('../tests/util')

module.exports = {
	setup: setup,
}

function setup(store) {
	var raw = true

	test('string compression', function() {
		store.set('foo', 'baz')
		assert(store.get('foo', raw) == 'ᄂゆ׬䀀', 'string should be lz compressed')
		assert(store.get('foo') == 'baz', 'value should be baz')
	})

	test('object compression', function () {
		var obj = { one: { two: 3 }}
		store.set('foo', obj)
		assert(store.get('foo', raw) == '㞂⃶ݠ꘠岠ᜃ릎٠⾆耀', 'object should be lz compressed')
		assert(util.deepEqual(store.get('foo'), obj), 'should deep equal original object')
		store.remove('foo')
	})

	test('decompress uncopmressed data', function () {
		// fake uncompressed data by storing raw value
		store.set('foo', 'baz', raw)
		assert(store.get('foo') == 'baz', 'value should be baz')
		store.remove('foo')
	})

	test('decompress non-existing data', function () {
		assert(store.get('bar') == undefined, 'value should be undefined')
		store.remove('bar')
	})

}
