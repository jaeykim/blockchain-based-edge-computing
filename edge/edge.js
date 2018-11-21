const promise = require('promise');
const fork = require('child_process').fork;
const spawn = require('child_process').spawn;
const path = require('path');

const stringify = JSON.stringify;

class Edge {
	constructor() {
	}

	// Program execution for pure function
	call(address, state, msg) {
		return new Promise((resolve, reject) => {
			var pgm = fork(path.resolve(address), [], { silent: true, env: { storage: stringify(state), msg: stringify(msg) } });
			pgm.on('message', (msg) => {
				switch(msg.cmd) {
					case 'balance':
						console.log("balance");
						console.log(msg.balance);
						break;
					case 'close':
						console.log("close");
						break;
					default:
						console.log("fallback");
				}
			});
			//pgm.stdout.pipe(process.stdout);
			pgm.stdout.on('data', function(data) {
				console.log('stdout: ' + data);
			});
			pgm.stderr.on('data', function(data) {
				console.log('stdout: ' + data);
			});
			pgm.on('close', function(code) {
				console.log('closing code: ' + code);
			});
		});
	}

	// Program execution for state transition
	send(address, state, msg) {

	}
}

var edge = new Edge();
edge.call('example.js', { a: 10 }, { sender: '0x1234' });
