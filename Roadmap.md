Roadmap
=======

v1.4.x:
-------

Dev env:
- [X] browserify, budo, babelify, uglifyify
- [X] scripts/open-live-tests.sh live reload of tests page
- [ ] scripts/compile-lib.sh compile store.js, store.min.js
- [X] figure out automatic test strategy.
- [ ] implement full test suite and runner
- [ ] enforce js style in compilation/tests

Open pull requests & issues:
- [ ] Module loading
	- [ ] Read through issues and come up with a design:
		- [ ] #78: AMD implementation breaks sites
		- [ ] #140: Almondjs
	- [ ] Investigate component.json. Do we need it?
	- [ ] Write test cases for all supported loading systems?
		- [ ] #91: Store is undefined when nesting in require (require.js)
	- [ ] Implement solution
- [ ] Browser-specific bugs
	- [ ] #84: IE10 on Win7 Throwing Error
	- [ ] #118: Hierarchy Request & Permission Denied Error on storageOwner.appendChild(storage) in IE
	- [ ] #132: store.disabled=true when userData is unavailable in IE
- [ ] #102: Content Security Policy doesn't like (browserified) store.js
	- [ ] Verify fixed or close
- [ ] #124: Not valid in strict mode
- [ ] #130: Throw error if .clear is called with arguments
- [ ] #117: Accurate detection localstorage is available
	- [ ] Ask for clarification: Use `1` testing instead of `'__store__'` - why?
	- [ ] Ask for clarification: Try get/set an already set keys - why?
	- [ ] Reproduce: Create failing test case
	- [ ] Fix failing test case
- [X] #120: Infinite loop in IE
	- [X] Reproduce: Create failing test case
	- [X] Fix failing test case
- [ ] #138: `typeof window` check
	- [ ] Reproduce: Create failing test case
	- [ ] Fix failing test case

Open issues


v2.x.x:
-------

Plugins system:
- [ ] identify a few example plugins (mostly from issues)
- [ ] Consider how https://github.com/evitolins/StoreFront.js does it
- [ ] how are plugins included+loaded?
- [ ] implement plugin system and a few example plugins
- [ ] Features to consider
	- [ ] Stored data structures (e.g #134, #136)
	- [ ] Encryption (#137)
	- [ ] Backwards forEach (#144)
	- [ ] #133: Handle namespace
	- [ ] #126: localStorage vs sessionStorage
	- [ ] #119: Fall back to in-memory storage
	- [ ] #129: noop if no supported options found


Examples to look at:
- [ ] Consider using json3 instead of json2: https://bestiejs.github.io/json3/
- [ ] https://github.com/evitolins/StoreFront.js
- [ ] http://download.github.io/memorystorage/
- [ ] https://github.com/nbubna/store
- [ ] http://rhaboo.org/


