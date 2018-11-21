const SHA256 = require('crypto-js/sha256');
const commandLineArgs = require('command-line-args');
const edge_debug = require('debug')('edge');
const BlockDB = require('../core/BlockDB.js');

// TODO: refine options
const argsDefinitions = [
	{ name: 'blockchain', type: String, multiple: false, defaultOption: true },
	{ name: 'address', type: String, multiple: false },
	{ name: 'state', type: String, multiple: false },
	{ name: 'sender', type: String, multiple: false }
];

// Edge class defines an API layer to implement edge computing technique
// embeded in our blockchain service layer.
// TODO Add challenging logic.
class Edge {
	constructor() {
		let args = commandLineArgs(argsDefinitions);
		this.blockDB = new BlockDB(args.blockchain);
		this.address = args.address;
		this.state = JSON.parse(args.state);
		this.input = JSON.parse(args.input);
		this.sender = args.sender;
	}

	getState(arg) {
		edge_debug('state: ' + this.state);
		return this.state[arg];
	}

	setState(state) {
		for (let key in state) {
			if (key in this.state) this.state[key] = state[key];
		}
		return 'Σ' + JSON.stringify(this.state);
	}

	getInput(arg) {
		edge_debug('input: ' + this.input);
		return this.input[arg];
	}

	getSender() {
		return this.sender;
	}

	getBalance(address, callback) {
		this.blockDB.get(address, (err, balance) => {
			callback(balance);
		});
	}

	setBalance(address, balance, callback) {
		this.blockDB.put(address, balance, (err) => {
			if (err) return console.error(err);
			callback();
		});
	}

	transmit(toAddress, amount, callback) {
		this.blockDB.get(this.address, (err, fromBalance) => {
			if (err) return console.error(err);
			this.blockDB.get(address, (err, toBalance) => {
				if (err) return console.error(err);
				if (fromBalance > amount) {
					this.blockDB.put(toAddress, toBalance + amount, (err) => {
						if (err) return console.error(err);
						this.blockDB.put(this.address, fromBalance - amount, (err) => {
							if (err) return console.error(err);
							callback();
						});
					});
				}
				return console.error("Insufficient balance");
			});
		});
	}

    /*
	getTxSigniture() {

	}

	validateSignature(signature) {

	}
    */

	hash(input) {
		return SHA256(input);
	}
}

module.exports = new Edge();
