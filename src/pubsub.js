var { create, each, bind, slice } = require('../util')

module.exports = {
	newPubSub: newPubSub
}

function newPubSub() {
	return create(pubSubBase, {
		_id: 0,
		_subSignals: {},
		_subCallbacks: {}
	})
}

var pubSubBase = {
	_id: null,
	_subCallbacks: null,
	_subSignals: null,
	on: function(signal, callback) {
		if (!this._subCallbacks[signal]) {
			this._subCallbacks[signal] = {}
		}
		this._id += 1
		this._subCallbacks[signal][this._id] = callback
		this._subSignals[this._id] = signal
		return this._id
	},
	off: function(subId) {
		var signal = this._subSignals[subId]
		delete this._subCallbacks[signal][subId]
		delete this._subSignals[subId]
	},
	once: function(signal, callback) {
		var subId = this.on(key, bind(this, function() {
			callback.apply(this, arguments)
			this.off(subId)
		}))
	},
	fire: function(signal) {
		var args = slice(arguments, 1)
		each(this._subCallbacks[signal], function(callback) {
			callback.apply(this, args)
		})
	}
}
