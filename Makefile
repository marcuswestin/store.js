test: test-node lint

test-node:
	node scripts/run-node-tests.js

test-browser:
	node scripts/run-browser-tests-live-reload.js

lint:
	./node_modules/.bin/eslint tests/* src/*      \
		--ignore-pattern tests/util/deepEqual.js  \
		--ignore-pattern src/addon/lib/json2.js   \

build: test lint
	mkdir -p build
	node scripts/compile-builds.js
