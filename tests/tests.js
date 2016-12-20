var tinytest = require('tinytest')
var { createStore } = require('../store-engine')
var { each } = require('../util')
var storages = require('../storage/all')
var allAddons = require('../addon/all')
var allAddonTests = require('../addon/all_tests')

var tests = module.exports = {
	output:null,
	outputError:null,
	runTests: runTests,
	failed:false
}

function runTests() {
	each(storages, function(storage) {
		if (!_checkEnabled(storage)) {
			return
		}

		test.group(storage.name, function() {
			test('Storage tests', function() {
				var store = createStore([storage], [])
				runStorageTests(store)
			})
			each(allAddonTests, function(addonTest, addonName) {
				var addon = allAddons[addonName]
				test.group('addon: '+addonName, function() {
					var store = createStore([storage], [addon])
					addonTest.setup(store)
				})
			})
		})
	})
	tinytest.runTests()
}

function _checkEnabled(storage) {
	if (!storage) {
		print('Skip unsupported storage:', storage.name)
		return false
	}
	var store = createStore([storage], [])
	if (store.disabled) {
		assert(!store.enabled)
		print('Skip disabled storage:', storage.name)
		return false
	}
	return true
}

function runStorageTests(store) {
	assert(store.enabled && !store.disabled, "store should be enabled")
	store.clearAll()

	store.get('unsetValue') // see https://github.com/marcuswestin/store.js/issues/63

	store.set('foo', 'bar')
	assert(store.get('foo') == 'bar', "stored key 'foo' not equal to stored value 'bar'")

	store.remove('foo')
	assert(store.get('foo') == null, "removed key 'foo' not null")
	assert(store.get('foo') === undefined, "removed key 'foo' not undefined")

	assert(store.has('foo') == false, "key 'foo' exists when it shouldn't")
	assert(store.set('foo','value') == 'value', "store#set returns the stored value")
	assert(store.has('foo') == true, "key 'foo' doesn't exist when it should")

	store.set('foo', 'bar1')
	store.set('foo', 'bar2')
	assert(store.get('foo') == 'bar2', "key 'foo' is not equal to second value set 'bar2'")

	store.set('foo', 'bar')
	store.set('bar', 'foo')
	store.remove('foo')
	assert(store.has('foo') == false, "key 'foo' exists when it shouldn't")
	assert(store.get('bar') == 'foo', "removing key 'foo' also removed key 'bar'")

	store.set('foo', 'bar')
	store.set('bar', 'foo')
	store.clearAll()
	assert(store.get('foo') == null && store.get('bar') == null, "keys foo and bar not cleared after store cleared")

	assert(store.get('defaultVal', 123) == 123, "store.get should return default value")

	store.set('foo', { name: 'marcus', arr: [1,2,3] })
	assert(typeof store.get('foo') == 'object', "type of stored object 'foo' is not 'object'")
	assert(store.get('foo') instanceof Object, "stored object 'foo' is not an instance of Object")
	assert(store.get('foo').name == 'marcus', "property 'name' of stored object 'foo' is not 'marcus'")
	assert(store.get('foo').arr instanceof Array, "Array property 'arr' of stored object 'foo' is not an instance of Array")
	assert(store.get('foo').arr.length == 3, "The length of Array property 'arr' stored on object 'foo' is not 3")

	assert(store.enabled = !store.disabled, "Store.enabled is not the reverse of .disabled");

	store.remove('circularReference')
	var circularOne = {}
	var circularTwo = { one:circularOne }
	circularOne.two = circularTwo
	var threw = false
	try { store.set('circularReference', circularOne) }
	catch(e) { threw = true }
	assert(threw, "storing object with circular reference did not throw")
	assert(!store.get('circularReference'), "attempting to store object with circular reference which should have faile affected store state")

	// If plain local storage was used before store.js, we should attempt to JSON.parse them into javascript values.
	// Store values using vanilla localStorage, then read them out using store.js
	var promoteValues = {
		'int'         : 42,
		'bool'        : true,
		'float'       : 3.141592653,
		'string'      : "Don't Panic",
		'odd_string'  : "{ZYX'} abc:;::)))"
	}
	for (var key in promoteValues) {
		store._storage.write(key, promoteValues[key])
	}
	for (var key in promoteValues) {
		assert(store.get(key) == promoteValues[key], key+" was not correctly promoted to valid JSON")
		store.remove(key)
	}

	store.clearAll()
	store.set('foo', 'bar')
	store.set('cat', { mat: true })
	store.set('hat', 'bat')
	var all = store.dump()
	assert(all.foo == 'bar', 'dump gets foo')
	assert(countProperties(all) == 3, 'dump gets all 4 values')
	
	assert(store.get('foo') == 'bar', "first pass key 'firstPassFoo' not equal to stored value 'bar'")

	store.clearAll()
	assert(store.get('foo') === undefined, "first pass key 'firstPassFoo' not undefined after store cleared")
	assert(countProperties(store.dump()) == 0, "dump returns 0 properties after store.clear() has been called")
}

function countProperties(obj) {
	var count = 0
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) { count++ }
	}
	return count
}
