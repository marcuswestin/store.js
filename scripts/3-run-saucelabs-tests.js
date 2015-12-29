#!/usr/bin/env node

var request = require('request')
var _ = require('lodash')

var username = 'storejs'
var password = new Buffer('ZjhjMzUyNjgtNzc2ZC00ZjlkLWEwNWUtN2FkM2Q0ZDgyNzk5', 'base64').toString('utf8')

var allPlatformSets = require('./util/saucelabs-platformSets')

runPlatformsTest('_'
	, allPlatformSets.singleBrowserRun
	// , allPlatformSets.allInternetExplorer
	// , allPlatformSets.ie6
	// , allPlatformSets.ie7
	// , allPlatformSets.ie8
	// , allPlatformSets.windows7Run
	// , allPlatformSets.majorDesktopRun
	// , allPlatformSets.androidRun
	// , allPlatformSets.iOSRun
	// , allPlatformSets.OSXRun
	// , allPlatformSets.problematic
)

// listAllSupportedPlatforms(function(platforms) { console.log(platforms) })

function listAllSupportedPlatforms(callback) {
	get('info/platforms/webdriver', function(platformsInfo) {
		var platforms = _.map(platformsInfo, function(info) {
			return [info['os'], info['api_name'], info['short_version']]
		})
		callback(filterUniquePlatforms(platforms))
	})
}

function getPlatformsArg(platformSets, callback) {
	listAllSupportedPlatforms(function(supportedPlatforms) {
		var allSupportedPlatforms = {}
		_.each(supportedPlatforms, function(platform) {
			allSupportedPlatforms[getPlatformId(platform)] = true
		})
		
		var platforms = _.flatten(_.flatten(_.flatten(
			_.map(platformSets, function(platformSet) {
				return _.map(platformSet, function(browserSpecs, osName) {
					return _.map(browserSpecs, function(browserVersions, browserName) {
						return _.map(browserVersions, function(browserVersion) {
							return [osName, browserName, browserVersion]
						})
					})
				})
			})
		)))
		
		_.each(platforms, function(platform) {
			if (!platform[2]) { return } // Don't sanity-check CURRENT_VERSION
			var platformId = getPlatformId(platform)
			if (!allSupportedPlatforms[platformId]) {
				throw new Error('Unsupported platform: '+platform.join(', ')+' ('+platformId+')')
			}
		})
		
		callback(filterUniquePlatforms(platforms))
	})
}

function getPlatformId(platform) {
	return platform.join('-')
		.replace('OS X', 'Mac')
		.replace('Windows XP', 'Windows 2003')
		.replace('Windows 7', 'Windows 2008')
		.replace('Windows 8', 'Windows 2012')
}

function filterUniquePlatforms(platforms) {
	var seen = {}
	return _.filter(platforms, function(platform) {
		var platformId = getPlatformId(platform)
		if (seen[platformId]) { return false }
		seen[platformId] = true
		return true
	})
}

function runPlatformsTest(___, platformsSet1, platformSet2, platformSetN) {
	var platformSets = Array.prototype.slice.call(arguments, 1)
	getPlatformsArg(platformSets, function(platforms) {
		var runTestsRes
		runTests('http://6d5bd3c9.ngrok.io/', platforms, function(res) {
			runTestsRes = res
			loopCheckStatus()
		})
		function loopCheckStatus() {
			getTestsStatus(runTestsRes, function(res) {
				if (res.completed) {
					console.log("Test suite completed")
					checkTestResults(res)
				} else {
					_.each(res['js tests'], function(test) {
						console.log(getTestStatus(test), test.id, test.status, status, test.platform)
					})
					console.log("CHECK AGAIN IN 5 SECONDS")
					setTimeout(loopCheckStatus, 5000)
				}
			})
		}
	})
}

function getTestStatus(test) {
	return (!test.result ? 'PENDING' : (test.result.failed ? 'FAILED' : 'PASSED'))
}

function checkTestResults(res) {
	var failed = 0
	_.each(res['js tests'], function(test) {
		console.log(getTestStatus(test), test.id, test.status, test.platform, test.url, test.result)
		if (getTestStatus(test) == 'FAILED') {
			failed += 1
		}
	})
	if (failed) {
		console.log(failed, 'TESTS FAILED!')
	} else {
		console.log('ALL TEST PASSED!')
	}
}

function getTestsStatus(runTestsRes, callback) {
	post('js-tests/status', { 'js tests':runTestsRes['js tests'] }, function(res) {
		callback(res)
	})
}

function runTests(url, platforms, callback) {
	post('js-tests', { url:url, platforms:platforms, framework:'custom', recordVideo:false, recordScreenshots:false, recordLogs:false }, callback)
}

function get(path, callback) {
	var params = {
		url: 'https://saucelabs.com/rest/v1/'+path,
		auth: { user:username, password:password }
	}
	// console.log("REQ", params)
	request.get(params, function(err, res, body) {
		if (err) {
			throw err
		}
		if (res.statusCode != 200) {
			console.log(params)
			throw new Error('Non-200 status code: '+body)
		}
		// console.log("RES", params.url, body)
		callback(JSON.parse(body))
	})
}


function post(path, data, callback) {
	var params = {
		url: 'https://saucelabs.com/rest/v1/'+username+'/'+path,
		auth: { user:username, password:password },
		json: data
	}
	// console.log("REQ", params)
	request.post(params, function(err, res, body) {
		if (err) {
			throw err
		}
		if (res.statusCode != 200) {
			throw new Error('Non-200 status code: '+body)
		}
		// console.log("RES", params.url, body)
		callback(body)
	})
}

// https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing+Methods#JavaScriptUnitTestingMethods-StartJSUnitTests