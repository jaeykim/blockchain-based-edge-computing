var Block = require('./Block.js');
var Blockchain = require('./Blockchain.js');
var Transaction = require('./Transaction.js');

let lynxChain = new Blockchain('lynx-address');

console.log('Creating some transactions...');
lynxChain.createTransaction(new Transaction('address1', 'address2', 100));
lynxChain.createTransaction(new Transaction('address2', 'address1', 50));

console.log("memPool state:");
lynxChain.getMemPoolState();

console.log('Starting the miner...');
lynxChain.minePendingTransactions('lynx-address');

console.log('Balance of lynx address is', lynxChain.getBalanceOfAddress('lynx-address'));

lynxChain.minePendingTransactions('lynx-address');
console.log('Balance of lynx address is', lynxChain.getBalanceOfAddress('lynx-address'));