const commandLineArgs = require('command-line-args');
const fs = require('fs');
const Engine = require('./core/engine/Engine.js');

var engine = new Engine('storage');

// TODO: refine options
const argsDefinitions = [
	{ name: 'application', type: String, multiple: false, defaultOption: true },
	{ name: 'constructor', type: String, multiple: false }
];

console.log(argsDefinitions);

var args = commandLineArgs(argsDefinitions);
console.log(args);

engine.deploy(args.application, fs.readFileSync(args.constructor, 'utf8'));
