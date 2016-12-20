module.exports = {
	name: 'update',
	mixin: update_mixin
}

function update_mixin(proxy) {
	return {
		update: update
	}
	
	function update(_, key, optDefaultVal, updateFn) {
		if (arguments.length == 2) {
			updateFn = optDefVal
		}
		var val = proxy.get(key, optDefaultVal)
		var retVal = updateFn(val)
		proxy.set(retVal != undefined ? retVal : val)
	}
}
