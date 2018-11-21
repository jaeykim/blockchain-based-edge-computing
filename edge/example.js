const libx = require('./libx');

//const edge = require('./newEdge.js')

// console.log(env);

//const state = JSON.parse(env.state);
/*
for (key in state) {
	console.log(key);
  this[key] = state[key];
}

console.log(this);
*/
/*
const run = async () => {
	//let balance = await edge.getBalance('A095FD3');
	//console.log('balance : ' + balance);

	console.log("asdf");
  process.send({cmd: 'balance', balance: 19});

	//balance = await edge.getBalance('A095FD3');
	//console.log('balance : ' + balance);

	process.send({cmd : 'output'});
    process.exit(10);
}

run();
*/

console.log(libx.storage);
console.log(libx.msg);

console.log("a: " + a);
