test:
	node scripts/run-node-tests.js
	make lint

test-browser:
	node scripts/run-browser-tests-live-reload.js

lint:
	./node_modules/.bin/eslint tests/* src/*      \
		--ignore-pattern tests/util/deepEqual.js  \
