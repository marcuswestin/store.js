#!/usr/local/bin/node

// simulate localStorage - must be done before importing tests
var { Global } = require('../src/util')
var LocalStorage = require('node-localstorage').LocalStorage
Global.localStorage = new LocalStorage('/tmp/store.js-test')

// Import and run tests
var tests = require('../tests/tests')

tests.runTests()
