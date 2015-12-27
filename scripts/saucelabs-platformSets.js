module.exports = (function(){
	// See https://wiki.saucelabs.com/display/DOCS/Platform+Configurator?_ga=1.24059122.934400320.1451142104#/
	var CURRENT_VERSION = ''
	var DEV_VERSION = 'dev'
	var BETA_VERSION = 'beta'
	var CHROME_VERSIONS = ['26.0', CURRENT_VERSION, BETA_VERSION, DEV_VERSION]
	var FIREFOX_VERSIONS = ['4.0', '5.0', '6.0', '7.0', CURRENT_VERSION, BETA_VERSION, DEV_VERSION]
	var OPERA_VERSIONS = ['11.64', '12.12']
	
	var singleBrowserRun = {
		'Linux': {
			'googlechrome': [CURRENT_VERSION]
		}
	}
	var windows7Run = {
		'Windows 7': {
			'internet explorer': ['8.0'],
			'googlechrome': ['26.0'],
			'firefox': ['4.0'],
			'opera': ['11.64'],
			'safari': ['5.1']			
		}
	}
	var majorDesktopRun = {
		'Windows XP': {
			'internet explorer': ['6.0', '7.0', '8.0'],
			'firefox': ['4.0', '5.0'],
			'opera': ['11.64'],
			'googlechrome': ['26.0']
		},
		'Windows 7': {
			'internet explorer': ['9.0'],
			'firefox': ['6.0', '7.0'],
			'opera': ['12.12'],
			'googlechrome': ['42.0']
		},
		'Windows 8': {
			'internet explorer': ['10.0'],
			'firefox': ['8.0'],
			'googlechrome': ['46.0']
		},
		'Windows 10': {
			'internet explorer': ['11.0'],
			'firefox': ['9.0', CURRENT_VERSION, BETA_VERSION, DEV_VERSION],
			'googlechrome': [CURRENT_VERSION, BETA_VERSION, DEV_VERSION]
		}
	}
	var majorMobileRun = null // TODO
	// var fullRun = combine(majorDesktopRun, majorMobileRun)
	
	var gauntletDesktopRun = {
		'Windows XP': {
			'internet explorer': ['6.0', '7.0', '8.0'],
			'googlechrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': OPERA_VERSIONS
		},
		'Windows 7': {
			'internet explorer': ['8.0', '9.0', '10.0', '11.0'],
			'googlechrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': OPERA_VERSIONS,
			'safari': ['5.1']
		},
		'Windows 8': {
			'internet explorer': ['10.0']
		},
		'Windows 8.1': {
			'internet explorer': []
		},
		'Windows 10': {
			'internet explorer': ['11.0'],
			'ms edge': ['20.10240']
		},
		'Linux': {
			'googlechrome': CHROME_VERSIONS,
			'firefox': FIREFOX_VERSIONS,
			'opera': ['12.15'],
		},
		'OS X 10.8': {
			'safari': ['6.0'],
			'firefox': FIREFOX_VERSIONS,
			'googlechrome': CHROME_VERSIONS
		},
		'OS X 10.9': {
			'safari': ['7.0']
		},
		'OS X 10.10': {
			'safari': ['8.0']
		},
		'OS X 10.11': {
			'safari': ['9.0']
		}
	}
	
	return {
		windows7Run: windows7Run,
		singleBrowserRun: singleBrowserRun,
		majorDesktopRun: majorDesktopRun,
		majorMobileRun: majorMobileRun,
		gauntletDesktopRun: gauntletDesktopRun
	}
}())