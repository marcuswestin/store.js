module.exports = {
	// Listed in order of usage preference
	'localStorage': require('./localStorage'),
	'oldFF-glolalStorage': require('./oldFF-glolalStorage'),
	'oldIE-userDataStorage': require('./oldIE-userDataStorage'),
	'cookieStorage': require('./cookieStorage'),
	'sessionStorage': require('./sessionStorage'),
	'memoryStorage': require('./memoryStorage'),
}
