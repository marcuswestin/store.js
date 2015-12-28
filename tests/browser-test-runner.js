var tests = require('./tests')

document.body.innerHTML = [
	'tests for <a href="http://github.com/marcuswestin/store.js">store.js</a>',
	'<div id="errorOutput"></div>'].join('\n')

		;(function() {
			var doc = document,
				errorOutput = doc.getElementById('errorOutput'),
				isSecondPass = (doc.location.hash == '#secondPass')

			tests.output = function output(msg) {
				errorOutput.appendChild(doc.createElement('div')).innerHTML = msg
			}
			tests.outputError = function outputError(msg) {
				var prefix = (isSecondPass ? 'second' : 'first') + ' pass '
				errorOutput.appendChild(doc.createElement('div')).innerHTML = prefix+msg
			}

			try {
				if (isSecondPass) { tests.runSecondPass() }
				else { tests.runFirstPass() }
			} catch(e) {
				tests.assert(false, 'Tests should not throw: "' + JSON.stringify(e) + '"')
			}

			if (!tests.failed) {
				if (!isSecondPass) {
					doc.location.hash = '#secondPass'
					doc.location.reload()
				} else {
					doc.location.hash = '#'
					doc.body.appendChild(doc.createElement('div')).innerHTML = 'Tests passed'
					
					// https://wiki.saucelabs.com/display/DOCS/Reporting+JavaScript+Unit+Test+Results+to+Sauce+Labs+Using+a+Custom+Framework
					window.global_test_results = {
						passed:1, failed:0, total:1, duration:0,
						tests:[{ name:'test', result:true, message:'passed', duration:0 }]
					}
				}
			} else {
				window.global_test_results = {
					passed:0, failed:1, total:1, duration:0,
					tests:[{ name:'test', result:false, message:'failed', duration:0 }]
				}
			}
		})()
