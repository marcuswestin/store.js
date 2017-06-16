var namespace = 'expire_mixin'

module.exports = expirePlugin

function expirePlugin() {
	var expirations = this.namespaceRaw(namespace)
	
	return {
		set: expire_set,
		get: expire_get,
		remove: expire_remove,
		getExpiration: getExpiration,
	}
	
	function expire_set(super_fn, key, val, expiration) {
		if (this != expirations) {
			expirations.set(key, expiration)
		}
		return super_fn()
	}

	function expire_get(super_fn, key) {
		if (this != expirations) {
			var expiration = expirations.get(key, Number.MAX_VALUE)
			if (expiration <= new Date().getTime()) {
				this.raw.remove(key)
			}
		}
		return super_fn()
	}
	
	function expire_remove(super_fn, key) {
		if (this != expirations) {
			expirations.remove(key)
		}
		return super_fn()
	}
	
	function getExpiration(super_fn, key) {
		return expirations.get(key)
	}
}
