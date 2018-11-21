const commandLineArgs = require('command-line-args');
var Storage = require('./Storage.js');
var Blockchain = require('./core/Blockchain.js');

// TODO: refine options
const argsDefinitions = [
	{ name: 'address', type: String, multiple: false, defaultOption: true }
];

// TODO: save/load address at levelDB like geth
let args = commandLineArgs(argsDefinitions);
if (!args) return console.log("Please set address with --address {address}");

var address = args.address;
var blockchain = new Blockchain(address);
