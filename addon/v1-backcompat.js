module.exports = {
	name: 'v1-backcompat',
	mixin: backcompat_mixin
}

function backcompat_mixin() {
	return {
		transact: backcompat_transact,
		clear: backcompat_clear,
		forEach: backcompat_forEach,
		getAll: backcompat_getAll,
		serialize: backcompat_serialize,
		deserialize: backcompat_deserialize
	}
}

function backcompat_transact(_) {
	return update.apply(this, arguments)
}
function backcompat_clear(_) {
	return clearAll.apply(this, arguments)
}
function backcompat_forEach(_) {
	return each.apply(this, arguments)
}
function backcompat_getAll(_) {
	return dump.apply(this, arguments)
}
function backcompat_serialize(_, value) {
	return JSON.stringify(value)
}
function backcompat_deserialize(_, value) {
	if (typeof value != 'string') { return undefined }
	try { return JSON.parse(value) }
	catch(e) { return value || undefined }
}