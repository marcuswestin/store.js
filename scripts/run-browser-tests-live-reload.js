#!/usr/bin/env node

var budo = require('budo')

budo(__dirname+'/../src/builds/test-runner.js', {
	live: true,
	stream: process.stdout,
	port: 9966,
	debug: true,
	open: true,
	title: 'store.js browser tests'
})
