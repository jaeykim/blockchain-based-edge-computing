const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, stateRoot, transactionRoot, previousHash = '', nonce = 0, previousDifficulty = 3) {
        this.index = index;
        this.timestamp = timestamp;
        this.stateRoot = stateRoot;
        this.transactionRoot = transactionRoot;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.difficulty = previousDifficulty;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    getHash() {
        return this.hash;
    }

    mineBlock() {
        while (this.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hash);
    }
}

module.exports = Block;
