// See https://wiki.saucelabs.com/display/DOCS/Platform+Configurator?_ga=1.24059122.934400320.1451142104#/
// See ./list-saucelabs-platforms.js
var CURRENT_VERSION = ''
var BETA_VERSION = 'beta'
var CHROME_VERSIONS = ['31', CURRENT_VERSION]
var FIREFOX_VERSIONS = ['4', '5', '6', '7', CURRENT_VERSION]
var OPERA_VERSIONS = ['11', '12']

var platforms = module.exports = {
	// Fast trial runs
	//////////////////
	fast: {
		'Linux': { 'chrome': [CURRENT_VERSION] }
	},

	// Common browser sets
	//////////////////////
	ie: {
		'Windows XP': { 'internet explorer': ['6', '7', '8'] },
		'Windows 7': { 'internet explorer': ['9'] },
		'Windows 8': { 'internet explorer': ['10'] },
		'Windows 10': { 'internet explorer': ['11'], 'microsoftedge': [CURRENT_VERSION] }
	},
	safari: {
		'Windows 7': { 'safari': ['5'] },
		'OS X 10.8': { 'safari': ['6'] },
		'OS X 10.9': { 'safari': ['7'] },
		'OS X 10.10': { 'safari': ['8'] },
		'OS X 10.11': { 'safari': ['9'] },
		'OS X 10.12': { 'safari': ['10'] }
	},
	firefox: {
		'Linux': { 'firefox': ['40'] },
		'Windows XP': { 'firefox': ['4', '5'] },
		'Windows 10': { 'firefox': [CURRENT_VERSION] },
		'Mac 10.12': { 'firefox': [CURRENT_VERSION] }
	},
	android: {
		'Linux': { 'android': ['4.4','5.0','5.1'] }
	},
	ios: {
		'Mac 10.10': {
			'ipad':  ['8.4'],
			'iphone':['8.4'],
		},
		'Mac 10.11': {
			'ipad':  ['9.3', '10.0'],
			'iphone':['9.3', '10.0'],
		}
	},
	chrome: {
		'Mac 10.12': { 'chrome':['27', CURRENT_VERSION] },
		'Windows 10': { 'chrome':['26', CURRENT_VERSION] }
	},

	// Individual browser versions
	//////////////////////////////
	ie6: { 'Windows XP': { 'internet explorer': ['6'] } },
	ie7: { 'Windows XP': { 'internet explorer': ['7'] } },
	ie8: { 'Windows XP': { 'internet explorer': ['8'] } },
	ie9: { 'Windows 7':  { 'internet explorer': ['9'] } },
	ie10:{ 'Windows 8':  { 'internet explorer': ['10'] } },
	ie11:{ 'Windows 10': { 'internet explorer': ['11'] } },

	firefox4: { 'Windows XP': { 'firefox': ['4'] } },
	firefox5: { 'Windows XP': { 'firefox': ['5'] } },

	problematic: {
		'Mac 10.10': { 'ipad': ['9.2'] },
		'Mac 10.11': { 'firefox': [BETA_VERSION] },
		'Windows XP': {
			'internet explorer': ['6', '7'],
			'firefox': ['5']
		}
	},
	
	windowsXPRun: {
		'Windows XP': {
			'internet explorer': ['6', '7', '8'],
			'firefox': ['4', '5', CURRENT_VERSION],
			'opera': ['11'],
			'chrome': ['26', '36', CURRENT_VERSION]
		}
	},
	windows7Run: {
		'Windows 7': {
			'internet explorer': ['8'],
			'chrome': ['26'],
			'firefox': ['4'],
			'opera': ['11'],
			'safari': ['5']
		}
	},
	OSXRun: {
		'OS X 10.8': {
			'safari': ['6'],
			'firefox': FIREFOX_VERSIONS
		},
		'OS X 10.9': {
			'safari': ['7'],
			'chrome': CHROME_VERSIONS
		},
		'OS X 10.10': {
			'safari': ['8']
		},
		'OS X 10.11': {
			'safari': ['9'],
			'firefox': FIREFOX_VERSIONS,
			'chrome': CHROME_VERSIONS
		}
	},
	majorDesktopRun: {
		'Windows XP': {
			'internet explorer': ['6', '7', '8'],
			'firefox': ['4', '5'],
			'opera': ['11'],
			'chrome': ['26']
		},
		'Windows 7': {
			'internet explorer': ['9'],
			'firefox': ['6', '7'],
			'opera': ['12'],
			'chrome': ['42']
		},
		'Windows 8': {
			'internet explorer': ['10'],
			'firefox': ['8'],
			'chrome': ['46']
		},
		'Windows 10': {
			'internet explorer': ['11'],
			'firefox': ['9', CURRENT_VERSION, BETA_VERSION],
			'chrome': [CURRENT_VERSION, BETA_VERSION]
		}
	},
	gauntletRun: {
		'Windows XP': {
			'internet explorer': ['6', '7', '8'],
			'chrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': OPERA_VERSIONS
		},
		'Windows 7': {
			'internet explorer': ['8', '9', '10', '11'],
			'chrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': OPERA_VERSIONS,
			'safari': ['5']
		},
		'Windows 8': {
			'internet explorer': ['10']
		},
		'Windows 8.1': {
			'internet explorer': []
		},
		'Windows 10': {
			'internet explorer': ['11'],
			'microsoftedge': [CURRENT_VERSION]
		},
		'OS X 10.8': {
			'safari': ['6'],
			'firefox': FIREFOX_VERSIONS
		},
		'OS X 10.9': {
			'safari': ['7'],
			'chrome': CHROME_VERSIONS
		},
		'OS X 10.10': {
			'safari': ['8']
		},
		'OS X 10.11': {
			'safari': ['9'],
			'ipad': ['9.3', '10.0']
		},
		'Linux': {
			'chrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': ['12'],
			'android': ['4.0','4.1','4.2','4.3','4.4','5.0','5.1']
		},
		'Mac 10.9': {
			'ipad': [CURRENT_VERSION],
			'iphone': [CURRENT_VERSION],
		},
		'Mac 10.10': {
			'ipad': ['8.4','9.2'],
			'iphone': ['8.4','9.2']
		}
	},
}
