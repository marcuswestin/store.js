Tests
=====

Run test on node.js:

	./tests/node-test-runner.js

Run test on local browser:

	./scripts/open-tests-live-reload-browser.sh

Run test suite across browsers using saucelabs:

	# In tab #1:
	./scripts/1-create-runner.sh
	# In tab #2:
	./scripts/2-ngrok-tunnel.sh
	# In tab #3:
	# First paste the ngrok endpoint into 3-run-saucelabs-test.js
	./scripts/3-run-saucelabs-tests.js