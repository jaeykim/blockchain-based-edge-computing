const promise = require('promise');
const fork = require('child_process').fork;
const path = require('path');

class newEdge {
	constructor() {
		this.accountInfo = {};
	}

	getBalance(address) {
		return new Promise((resolve, reject) => {
			process.send({cmd: 'balance', address: address});

			let callback = ((balance) => {
				process.removeListener('message', callback);
				resolve(balance);
			});

			process.on('message', callback);
		});
	}

	setBalance (address, balance) {
		this.accountInfo[address] = balance;
	}

	runSmartContract(src) {
		return new Promise((resolve, reject) => {
			const contract = fork(path.resolve(src), [], {});

			contract.on('message', (msg) => {
				switch (msg.cmd){
					case 'balance':
						this.accountInfo[msg.address] !== undefined ?
							contract.send(this.accountInfo[msg.address]) :
							this.getBalance(msg.address).then((balance) => {
								this.setBalance(msg.address, balance);
								contract.send(balance);
							});
						break;
					case 'output':
						console.log('killed ' + src);
						contract.kill();
						resolve('output');
				}
			});

		});
	}
}

module.exports = new newEdge();
