const assert = require('assert');

var env = process.env;
console.log('env: ' + JSON.stringify(env));
console.log(typeof env);
var state = JSON.parse(env["state"]);
console.log('state: ' + state);
console.log(typeof state);
console.log('keys of state: ' + Object.keys(state));
var msg = JSON.parse(env["msg"]);

class Libx {
	constructor(pgm) {
		// Initialize the program
		this['pgm'] = new pgm(state);
		console.log("state: " + state);
		console.log("keys of state: " + Object.keys(state));
		Object.keys(state).forEach((key, index) => {
			console.log("key in state: " + key);
			this[key] = state[key];
		});
		
		//this.now = Date.now(); // TODO: convert this to block timestamp
	}

	end() {
		console.log("Object.keys(this): " + Object.keys(this));
		Object.keys(this).forEach((key, index) => {
			console.log("key: " + key + ", this[key]: " + this[key]);
			if (key !== "msg" && this[key]) {
				state[key] = this[key];
			}
		});
		process.send({ cmd: 'end', state: JSON.stringify(state), msg: msg });
	}

	setValue(key, value) {
		let pair = {};
		pair[key] = value;
		process.send({ cmd: 'setValue', pair: pair });
	}

	returnValue(value) {
		process.send({ cmd: 'returnValue', value });
	}
}

module.exports = new Libx();
