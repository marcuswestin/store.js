var tinytest = require('tinytest')

tinytest.hijackConsoleLog()

var { createStore } = require('../src/store-engine')
var { each } = require('../src/util')
var storages = require('../storages/all')
var allPlugins = require('../plugins/all')
var allPluginTests = require('../plugins/all_tests')

module.exports = {
	output:null,
	outputError:null,
	runTests: runTests,
	failed:false,
}

function runTests() {
	each(storages, function(storage) {
		test.group(storage.name, function() {
			if (!_checkEnabled(storage)) {
				test.skip('disabled')
			}
			test('Storage tests', function() {
				var store = createStore()
				store.addStorage(storage)
				runStorageTests(store)
			})
			each(allPluginTests, function(pluginTest, pluginName) {
				var plugin = allPlugins[pluginName]
				test.group('plugin: '+pluginName, function() {
					var store = createStore()
					store.addStorage(storage)
					store.addPlugin(plugin)
					pluginTest.setup(store)
				})
			})
		})
	})
	
	tinytest.runTests({
		failFast: false
	})
}

function _checkEnabled(storage) {
	if (!storage) {
		print('Skip unsupported storage:', storage.name)
		return false
	}
	var store = createStore([storage], [])
	if (!store.enabled) {
		print('Skip disabled storage:', storage.name)
		return false
	}
	return true
}

function runStorageTests(store) {
	assert(store.enabled && store.enabled, "store should be enabled")
	store.clearAll()

	store.get('unsetValue') // see https://github.com/marcuswestin/store.js/issues/63

	store.set('foo', 'bar')
	assert(store.get('foo') == 'bar', "stored key 'foo' not equal to stored value 'bar'")

	store.remove('foo')
	assert(store.get('foo') === undefined, "removed key 'foo' not undefined")

	assert(store.get('foo') === undefined, "key 'foo' exists when it shouldn't")
	assert(store.set('foo','value') == 'value', "store#set returns the stored value")
	assert(store.get('foo') !== undefined, "key 'foo' doesn't exist when it should")

	store.set('foo', 'bar1')
	store.set('foo', 'bar2')
	assert(store.get('foo') == 'bar2', "key 'foo' is not equal to second value set 'bar2'")

	store.set('foo', 'bar')
	store.set('bar', 'foo')
	store.remove('foo')
	assert(store.get('foo') === undefined, "key 'foo' exists when it shouldn't")
	assert(store.get('bar') == 'foo', "removing key 'foo' also removed key 'bar'")

	store.set('foo', 'bar')
	store.set('bar', 'foo')
	store.clearAll()
	assert(store.get('foo') === undefined && store.get('bar') === undefined, "keys foo and bar not cleared after store cleared")

	assert(store.get('defaultVal', 123) == 123, "store.get should return default value")

	store.set('foo', { name: 'marcus', arr: [1,2,3] })
	assert(typeof store.get('foo') == 'object', "type of stored object 'foo' is not 'object'")
	assert(store.get('foo') instanceof Object, "stored object 'foo' is not an instance of Object")
	assert(store.get('foo').name == 'marcus', "property 'name' of stored object 'foo' is not 'marcus'")
	assert(store.get('foo').arr instanceof Array, "Array property 'arr' of stored object 'foo' is not an instance of Array")
	assert(store.get('foo').arr.length == 3, "The length of Array property 'arr' stored on object 'foo' is not 3")

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
		store._storage.resolved.write(key, promoteValues[key])
		assert(store.get(key) == promoteValues[key], key+" was not correctly promoted to valid JSON")
		store.remove(key)
	}
	store.clearAll()
	var count = 0
	store.each(function() {
		count += 1
	})
	assert(count === 0)
}
