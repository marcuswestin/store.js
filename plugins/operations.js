var { slice, assign } = require('../src/util')
var update_mixin = require('./update')

module.exports = {
	name: 'operations',
	dependencies: [update_mixin],
	mixin: operations_mixin,
}

function operations_mixin() {
	return {
		// array
		push: operations_push,
		pop: operations_pop,
		shift: operations_shift,
		unshift: operations_unshift,
		
		// obj
		assign: operations_assign
	}
	
	// array
	function operations_push(_, key, val1, val2, val3, etc) {
		return _arrayOp.call(this, 'push', arguments)
	}
	function operations_pop(_, key) {
		return _arrayOp.call(this, 'pop', arguments)
	}
	function operations_shift(_, key) {
		return _arrayOp.call(this, 'shift', arguments)
	}
	function operations_unshift(_, key, val1, val2, val3, etc) {
		return _arrayOp.call(this, 'unshift', arguments)
	}
	
	// obj
	function operations_assign(_, key, props1, props2, props3, etc) {
		var varArgs = slice(arguments, 2)
		return this.update(key, {}, function(val) {
			if (typeof val != 'object') {
				throw new Error('store.assign called for non-object value with key "'+key+'"')
			}
			varArgs.unshift(val)
			return assign.apply(Object, varArgs)
		})
	}
	
	// internal
	///////////	
	function _arrayOp(arrayFn, opArgs) {
		var res
		var key = opArgs[1]
		var rest = slice(opArgs, 2)
		this.update(key, [], function(arrVal) {
			res = Array.prototype[arrayFn].apply(arrVal, rest)
		})
		return res
	}
}
