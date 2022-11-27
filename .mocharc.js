'use strict'

module.exports = {
	recursive: false,
	slow: 5000,
	extension: ['js'],
	exit: true,
	reporter: 'min',
	spec: './src/integration-tests/*.test.js',
	color: true,
	package: './package.json',
	timeout: 50000,
	ui: 'bdd',
	diff: true,
	bail: true,
	require: ['mocha-suppress-logs'],
}
