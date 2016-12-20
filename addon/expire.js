module.exports = {
	name: 'expire',
	mixin: expire_mixin
}

function expire_mixin(store) {
	var expirations = store.namespace('expire')
	
	return {
		set: expire_set,
		get: expire_get,
		remove: expire_remove
	}
	
	function expire_set(super_fn, key, val, expiration) {
		expirations.set(key, expiration)
		return super_fn()
	}
	
	function expire_get(super_fn, key) {
		var expiration = expirations.get(key, Number.MAX_VALUE)
		if (expiration <= new Date()) {
			expire_remove(key)
		}
		return super_fn()
	}
	
	function expire_remove(super_fn, key) {
		expirations.remove(key)
		return super_fn()
	}
}
