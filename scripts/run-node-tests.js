#!/usr/local/bin/node

var LocalStorage = require('node-localstorage').LocalStorage
var tests = require('../tests/tests')

global.localStorage = new LocalStorage('/tmp/store.js-test')

tests.runTests()
