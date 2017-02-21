#!/usr/local/bin/node

// simulate localStorage - must be done before importing tests
var { global } = require('../src/util')
var LocalStorage = require('node-localstorage').LocalStorage
global.localStorage = new LocalStorage('/tmp/store.js-test')

// Import and run tests
var tests = require('../tests/tests')

tests.runTests()
