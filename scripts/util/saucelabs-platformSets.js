// See https://wiki.saucelabs.com/display/DOCS/Platform+Configurator?_ga=1.24059122.934400320.1451142104#/
// See ./list-saucelabs-platforms.js
var CURRENT_VERSION = ''
var BETA_VERSION = 'beta'
var CHROME_VERSIONS = ['31', CURRENT_VERSION, BETA_VERSION]
var FIREFOX_VERSIONS = ['4', '5', '6', '7', CURRENT_VERSION, BETA_VERSION]
var OPERA_VERSIONS = ['11', '12']

var platforms = module.exports = {
	problematic: {
		'Mac 10.10': { 'ipad': ['9.2'] },
		'Mac 10.11': { 'firefox': [BETA_VERSION] },
		'Windows XP': {
			'internet explorer': ['6', '7'],
			'firefox': ['5']
		}
	},
	singleBrowserRun: {
		'Linux': {
			'chrome': [CURRENT_VERSION]
		}
	},
	ie6: { 'Windows XP': { 'internet explorer': ['6'] } },
	ie7: { 'Windows XP': { 'internet explorer': ['7'] } },
	ie8: { 'Windows XP': { 'internet explorer': ['8'] } },
	allInternetExplorer: {
		'Windows XP': {
			'internet explorer': ['6', '7', '8']
		},
		'Windows 7': {
			'internet explorer': ['9']
		},
		'Windows 8': {
			'internet explorer': ['10']
		},
		'Windows 10': {
			'internet explorer': ['11', CURRENT_VERSION]
		}
	},
	safari: {
		'Windows 7': { 'safari': ['5'] },
		'OS X 10.8': { 'safari': ['6'] },
		'OS X 10.9': { 'safari': ['7'] },
		'OS X 10.10': { 'safari': ['8'] },
		'OS X 10.11': { 'safari': ['9'] }
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
	androidRun: {
		'Linux': {
			'android': ['4.0','4.1','4.2','4.3','4.4','5.0','5.1']
		}
	},
	iOSRun: {
		'Mac 10.8': {
			'ipad': ['5.1','6.0'],
			'iphone': ['5.1','6.0']
		},
		'Mac 10.9': {
			'ipad': ['7.0','7.1'],
			'iphone': ['7.0','7.1'],
		},
		'Mac 10.10': {
			'ipad': ['8.4','9.2'],
			'iphone': ['8.4','9.2']
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
			'microsoftedge': ['20']
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
			'safari': ['9']
		},
		'Linux': {
			'chrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': ['12'],
			'android': ['4.0','4.1','4.2','4.3','4.4','5.0','5.1']
		},
		'Mac 10.8': {
			'ipad': ['5.1','6.0'],
			'iphone': ['5.1','6.0']
		},
		'Mac 10.9': {
			'ipad': ['7.0','7.1'],
			'iphone': ['7.0','7.1'],
		},
		'Mac 10.10': {
			'ipad': ['8.4','9.2'],
			'iphone': ['8.4','9.2']
		}
	}
}
