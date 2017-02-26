var events_mixin = require('./events')

module.exports = {
	name: 'observe',
	dependencies: [events_mixin],
	mixin: observe_mixin
}

function observe_mixin() {
	return {
		observe: observe,
		unobserve: unobserve
	}

	function observe(_, key, callback) {
		var subId = this.watch(key, callback)
		callback(this.get(key))
		return subId
	}
	function unobserve(_, subId) {
		this.unwatch(subId)
	}
}
