const edge = require('./newEdge.js')

const run = async () => {
	console.log('[test.js]');

    process.send({cmd: 'balance', balance: 19});
	//let balance = await edge.getBalance('A095FD3');
	let output = await edge.runSmartContract('example.js');
	process.send({cmd : 'output'});
}

run();

