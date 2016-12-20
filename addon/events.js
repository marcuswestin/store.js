var { bind, each } = require('../util')
var { newPubSub } = require('../src/pubsub')

module.exports = {
	name: 'events',
	mixin: events_mixin
}

function events_mixin() {
	var pubsub = newPubSub()
	
	return {
		watch: watch,
		unwatch: unwatch,
		once: once,
		
		set: set,
		remove: remove,
		clearAll: clearAll
	}
	
	// new pubsub functions
	function watch(_, key, listener) {
		return pubsub.on(key, bind(this, listener))
	}
	function unwatch(_, subId) {
		pubsub.off(subId)
	}
	function once(_, key, listener) {
		pubsub.once(key, bind(this, listener))
	}
	
	// overwrite function to fire when appropriate
	function set(super_fn, key, val) {
		var oldVal = this.get(key)
		super_fn()
		pubsub.fire(key, val, oldVal)
	}
	function remove(super_fn, key) {
		var oldVal = this.get(key)
		super_fn()
		pubsub.fire(key, undefined, oldVal)
	}
	function clearAll(super_fn) {
		var oldVals = {}
		this.each(function(val, key) {
			oldVals[key] = val
		})
		super_fn()
		each(oldVals, function(oldVal, key) {
			pubsub.fire(key, undefined, oldVal)
		})
	}
}
