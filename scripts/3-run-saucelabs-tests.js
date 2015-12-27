#!/usr/bin/env node

var request = require('request')
var _ = require('lodash')

var username = 'storejs'
var password = new Buffer('ZjhjMzUyNjgtNzc2ZC00ZjlkLWEwNWUtN2FkM2Q0ZDgyNzk5', 'base64').toString('utf8')

var platformSets = require('./saucelabs-platformSets')

runPlatformsTest(platformSets.singleBrowserRun)
// runPlatformsTest(platformSets.windows7Run)
// runPlatformsTest(platformSets.majorDesktopRun)

function getPlatformsArg(platformsSet) {
	var res = _.map(platformsSet, function(browserSpecs, osName) {
		return _.map(browserSpecs, function(browserVersions, browserName) {
			return _.map(browserVersions, function(browserVersion) {
				return [osName, browserName, browserVersion, false]
			})
		})
	})
	return _.flatten(_.flatten(res))
}

function runPlatformsTest(platformsSet) {
	var runTestsRes
	var platforms = getPlatformsArg(platformsSet)
	runTests('https://538dc303.ngrok.io/', platforms, function(res) {
		runTestsRes = res
		loopCheckStatus()
	})
	function loopCheckStatus() {
		getTestsStatus(runTestsRes, function(res) {
			if (res.completed) {
				console.log("Test suite completed")
				checkTestResults(res)
			} else {
				console.log("NOT DONE", res)
				console.log("CHECK AGAIN IN 5 SECONDS")
				setTimeout(loopCheckStatus, 5000)
			}
		})
	}


function checkTestResults(res) {
	var failed = false
	_.each(res['js tests'], function(test) {
		test.result.platform = test.platform
		test.result.url = test.url
		if (test.result.failed) {
			console.log("FAILED", test.platform, test.url)
		}
	})
	if (!failed) {
		console.log("ALL PASSED!")
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