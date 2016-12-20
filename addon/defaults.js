module.exports = {
	name: 'defaults',
	mixin: defaults_mixin
}

function defaults_mixin() {
	var defaultValues = {}
	
	return {
		defaults: defaults,
		get: defaults_get
	}
	
	function defaults(_, values) {
		defaultValues = values
	}
	
	function defaults_get(super_fn, key) {
		var val = super_fn()
		return (val !== undefined ? val : defaultValues[key])
	}
}