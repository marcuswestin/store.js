const LZString = require('./lib/lz-string')

module.exports = compressionPlugin

function compressionPlugin() {
	return {
		get: get,
		set: set,
	}

	function get(super_fn, key, raw) {
		var val = super_fn(key)
		if (!val || raw) return val
		var decompressed = LZString.decompress(val)
		// fallback to existing values that are not compressed
		return (decompressed == null) ? val : JSON.parse(decompressed)
	}

	function set(super_fn, key, val, raw) {
		if (raw) return super_fn(key, val)
		var compressed = LZString.compress(JSON.stringify(val))
		super_fn(key, compressed)
	}
}
