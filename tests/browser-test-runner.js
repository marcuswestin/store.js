var tests = require('./tests')

document.body.innerHTML = [
	'tests for <a href="http://github.com/marcuswestin/store.js">store.js</a>',
	'<div id="errorOutput"></div>'].join('\n')

		;(function() {
			var doc = document,
				errorOutput = doc.getElementById('errorOutput'),
				isSecondPass = (doc.location.hash == '#secondPass')

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
				}
			}
		})()
