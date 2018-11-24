const SHA256 = require('crypto-js/sha256');
var Transaction = require('./Transaction.js');
var merkle = require('./merkle.js');

class Tx_tree {
    constructor(txs) {
        this.tree = merkle('sha256').sync(txs);
        console.log(this.tree.root());
        console.log(this.tree.depth());
    }
}
