var tests = module.exports = {
	output:null,
	outputError:null,
	assert:assert,
	runFirstPass:runFirstPass,
	runSecondPass:runSecondPass,
	failed:false
}

function assert(truthy, msg) {
	tests.output('assert: '+msg)
	if (!truthy) {
		tests.outputError('assert failed: ' + msg)
		tests.failed = true
	}
}

function runFirstPass(store) {
	assert(!store.disabled, "store should be enabled")
	store.clear()

	store.get('unsetValue') // see https://github.com/marcuswestin/store.js/issues/63

	store.set('foo', 'bar')
	assert(store.get('foo') == 'bar', "stored key 'foo' not equal to stored value 'bar'")

	store.remove('foo')
	assert(store.get('foo') == null, "removed key 'foo' not null")

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
	store.clear()
	assert(store.get('foo') == null && store.get('bar') == null, "keys foo and bar not cleared after store cleared")

	assert(store.get('defaultVal', 123) == 123, "store.get should return default value")

	store.transact('foosact', function(val) {
		assert(typeof val == 'object', "new key is not an object at beginning of transaction")
		val.foo = 'foo'
	})
	store.transact('foosact', function(val) {
		assert(val.foo == 'foo', "first transaction did not register")
		val.bar = 'bar'
	})
	assert(store.get('foosact').bar == 'bar', "second transaction did not register")

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
	if (typeof localStorage != 'undefined') {
		var promoteValues = {
			'int'         : 42,
			'bool'        : true,
			'float'       : 3.141592653,
			'string'      : "Don't Panic",
			'odd_string'  : "{ZYX'} abc:;::)))"
		}
		for (var key in promoteValues) {
			localStorage.setItem(key, promoteValues[key])
		}
		for (var key in promoteValues) {
			assert(store.get(key) == promoteValues[key], key+" was not correctly promoted to valid JSON")
			store.remove(key)
		}
	}

	// The following stored values get tested in doSecondPass after a page reload
	store.set('firstPassFoo', 'bar')
	store.set('firstPassObj', { woot: true })

	var all = store.getAll()
	assert(all.firstPassFoo == 'bar', 'getAll gets firstPassFoo')
	assert(countProperties(all) == 4, 'getAll gets all 4 values')
}

function runSecondPass(store) {
	assert(store.get('firstPassFoo') == 'bar', "first pass key 'firstPassFoo' not equal to stored value 'bar'")

	var all = store.getAll()
	assert(all.firstPassFoo == 'bar', "getAll still gets firstPassFoo on second pass")
	assert(countProperties(all) == 4, "getAll gets all 4 values")

	store.clear()
	assert(store.get('firstPassFoo') == null, "first pass key 'firstPassFoo' not null after store cleared")

	var all = store.getAll()
	assert(countProperties(all) == 0, "getAll returns 0 properties after store.clear() has been called")
}

function countProperties(obj) {
	var count = 0
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) { count++ }
	}
	return count
}
