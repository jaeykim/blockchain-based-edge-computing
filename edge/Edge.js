const SHA256 = require('crypto-js/sha256');
const commandLineArgs = require('command-line-args');
const edge_debug = require('debug')('edge');

// TODO: refine options
const argsDefinitions = [
	{ name: 'blockchain', type: String, multiple: false, defaultOption: true },
	{ name: 'address', type: String, multiple: false },
	{ name: 'state', type: String, multiple: false },
	{ name: 'msg', type: String, multiple: false }
];

// Edge class defines an API layer to implement edge computing technique
// embeded in our blockchain service layer.
// TODO Add challenging logic.
class Edge {
	constructor() {
		let args = commandLineArgs(argsDefinitions);
		this.address = args.address;
		this.state = JSON.parse(args.state);
        this.msg = JSON.parse(args.msg);
    }

    hash(input) {
        return SHA256(input);
    }
}

module.exports = new Edge();
