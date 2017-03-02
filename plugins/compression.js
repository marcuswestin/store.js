const LZString = require('./lib/lz-string')

module.exports = compressionPlugin

function compressionPlugin() {
	return {
		decompress: decompress,
		compress: compress,
	}

	function decompress(_, key) {
		var val = this.get(key)
		if (!val) return val
		return JSON.parse(LZString.decompress(val))
	}

	function compress(_, key, val) {
		var compressed = LZString.compress(JSON.stringify(val))
		this.set(key, compressed)
	}
}
