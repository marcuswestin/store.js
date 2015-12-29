#!/usr/bin/env node

var budo = require('budo')

budo(__dirname+'/../tests/browser-test-runner-live.js', {
	live: true,
	stream: process.stdout,
	port: 9966,
	debug: true,
	open: true,
	title: 'store.js browser tests'
})
