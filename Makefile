test: test-node lint

test-node:
	node scripts/run-node-tests.js

test-browser:
	node scripts/run-browser-tests-live-reload.js

test-saucelabs: build test-node lint
	node scripts/run-saucelabs-tests.js

tunnel:
	node scripts/create-tunnel.js

build:
	node scripts/compile-builds.js

lint:
	./node_modules/.bin/eslint tests/* src/* plugins/* storages/*  \
		--ignore-pattern src/addon/lib/json2.js                    \
