const assert = require('assert');

var env = process.env;
//console.log('env: ' + JSON.stringify(env));
//console.log(typeof env);
var state = JSON.parse(env["state"]);
console.log('passed state: ' + JSON.stringify(state));
//console.log(typeof state);
//console.log('keys of state: ' + Object.keys(state));
var msg = JSON.parse(env["msg"]);

// TODO: make this an npm module later
class Libx {
    constructor() {
		Object.keys(state).forEach((key, index) => {
			//console.log("key in state: " + key);
			this[key] = state[key];
		});
        this['msg'] = msg;
    }

	end() {
        console.log("[end] state: " + JSON.stringify(state));
		console.log("Object.keys(this): " + Object.keys(this));
		Object.keys(this).forEach((key, index) => {
			console.log("key: " + key + ", this[key]: " + this[key]);
			if (key !== "msg" && this[key] !== undefined) {
				state[key] = this[key];
                console.log(`state[${key}] = ${this[key]}`);
			}
		});
        console.log("Libx state: " + JSON.stringify(state));
		process.send({ cmd: 'end', state: JSON.stringify(state), msg: msg });
	}

    apply() {
        this[msg["func"]](...msg["args"]);
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

//module.exports = new Libx();
module.exports = Libx;
