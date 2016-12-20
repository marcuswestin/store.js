var { each } = require('../util')
var { allStorages, deepEqual } = require('../tests/util')

require('./operations')

module.exports = {
	setup: setup
}

function setup(store) {

	test('push', function() {
		_testArrayOp('push', [], [
			[],
			['a']
			['b','c'],
			[undefined],
			[null],
			[[], {}]
		])
	})

	test('unshift', function() {
		_testArrayOp('unshift', [], [
			[],
			['a']
			['b','c'],
			[undefined],
			[null],
			[[], {}]
		])
	})

	test('pop', function() {
		var arr = ['a', 'b', 'c', undefined, null, [[], {}]]
		var reverse = slice(arr, 0).reverse()
		_testArrayOp('pop', arr, reverse)
	})

	test('shift', function() {
		var arr = ['a', 'b', 'c', undefined, null, [[], {}]]
		var copy = slice(arr, 0)
		_testArrayOp('pop', arr, copy)
	})

	test('assign', function() {
		var expect = { bar:'cat', mat:{ hat:'bat', arr:[1,2,3] }}
		store.assign('foo', expect)
		assert(deepEqual(store.get('foo'), expect))
		var add = { bar:'cat2', mat:{ hat:'bat2' }, newProp:'newProp'}
		store.assign('foo', add)
		each(add, function(val, key) {
			expect[key] = val
		})
		assert(deepEqual(store.get('foo'), expect))
	})

	function _testArrayOp(fnName, arr, argLists) {
		var arrFn = arr[fnName]
		var storeFn = store[fnName]
		each(argLists, function(args) {
			var expectedFnResult = arrFn.apply(arr, args)
			args.unshift('foo')
			var actualFnResult = storeFn.apply(store, args)
			assert(expectedFnResult === actualFnResult)
			assert(deepEqual(arr, store.get('foo')))
		})
	}

}