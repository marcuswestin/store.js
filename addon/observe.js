var events_mixin = require('./events')

module.exports = {
	name: 'observe',
	dependencies: [events_mixin],
	mixin: observe_mixin
}

function observe_mixin() {
	return {
		observe: function() {
			throw new Error("TODO: Implement observe_mixin")
		}
	}
}