var namespace = 'expire_mixin'

module.exports = expirePlugin

function expirePlugin() {
	var expirations = this.namespace(namespace)
	
	return {
		set: expire_set,
		get: expire_get,
		remove: expire_remove
	}
	
	function expire_set(super_fn, key, val, expiration) {
		if (!this.hasNamespace(namespace)) {
			expirations.set(key, expiration)
		}
		return super_fn()
	}
	
	function expire_get(super_fn, key) {
		if (!this.hasNamespace(namespace)) {
			var expiration = expirations.get(key, Number.MAX_VALUE)
			if (expiration <= new Date().getTime()) {
				this.remove(key)
			}
		}
		return super_fn()
	}
	
	function expire_remove(super_fn, key) {
		if (!this.hasNamespace(namespace)) {
			expirations.remove(key)
		}
		return super_fn()
	}
}
