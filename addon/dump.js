module.exports = {
	name: 'dump',
	mixin: dump_mixin
}

function dump_mixin() {
	return {
		dump: dump
	}
	
	function dump(_) {
		var res = {}
		this.each(function(val, key) {
			res[key] = val
		})
		return res
	}
}
