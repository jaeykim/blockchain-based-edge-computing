const SHA256 = require('crypto-js/sha256');
const commandLineArgs = require('command-line-args');
const edge_debug = require('debug')('edge');
const fork = require('child_process').fork
const path = require('path')
//const BlockDB = require('../core/BlockDB.js');

const argsDefinitions = [
	{ name: 'blockchain', type: String, multiple: false, defaultOption: true },
	{ name: 'address', type: String, multiple: false },
	{ name: 'sender', type: String, multiple: false },
	{ name: 'state', type: String, multiple: false },
	{ name: 'input', type: String, multiple: false }
];

class mainUtils {
	constructor() {
//		let args = commandLineArgs(argsDefinitions);
//		//this.blockDB = new BlockDB(args.blockchain);
//		this.address = args.address;
//		this.state = JSON.parse(args.state);
//		this.input = JSON.parse(args.input);
//		this.sender = args.sender;
	}

	runSmartContract(src) {
		return new Promise((resolve, reject) => {
			const contract = fork(path.resolve(src), [], {});

			contract.on('message', (msg) => {
                console.log(msg);
				switch (msg.cmd){
					case 'balance':
						//this.blockDB.get(address, (err, balance) => {
						//	contract.send(balance);
						//});

						contract.send('100won');
						break;
					case 'output':
						contract.kill();
						console.log('killed ' + src);
						resolve('output')
				}
			});

		});
	}
}

module.exports = new mainUtils();
