class Libx {
	constructor() {
		var env = process.env;
		this.storage = JSON.parse(env.storage);
		//this.msg = JSON.parse(env.msg);
		this.msg = {
			sender: "0x1234",
			value: 100,

		this.now = Date.now(); // TODO: convert this to block timestamp

		// Set Environment
		for (let key in this.storage) {
			global[key] = this.storage[key];
		}
		global.msg = this.msg;
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
