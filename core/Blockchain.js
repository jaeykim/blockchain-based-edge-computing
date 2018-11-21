var merkle = require('merkle');
var Block = require('./Block.js');
var Transaction = require('./Transaction.js');
var Engine = require('./core/Engine.js');

// Blockchain class defines the data structure of the full (validating) node
// in the blockchain network, as well as the APIs to make use of the system.
const coinbase = new Array(64).join('0');

class Blockchain {
	constructor(miningRewardAddress) {
		// Blockchain
		this.chain = [this.createGenesisBlock()];
		this.engine = new Engine(this, 'blockchain');

		// Reward for miner
        this.coinbase = coinbase;
		this.miningReward = 100;
		this.miningRewardAddress = miningRewardAddress;

		// Memory Pool for storing pending transactions
		this.memPool = [
			new Transaction(0, this.coinbase, this.miningRewardAddress, false, this.miningReward, null, null)
		];
	}

	createGenesisBlock(date) {
        if (date) return new Block(0, date, [], "Genesis block", 3);
        else return new Block(0, new Date(), coinbase, coinbase, "Genesis block", 3);
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	createTransaction(transaction) {
		this.memPool.push(transaction);
	}

	// Debug
	getMemPoolState() {
		for (const tx in this.memPool) {
			console.log(this.memPool[tx]);
		}
	}

	minePendingTransactions() {
		let latestBlock = this.getLatestBlock(); // latestBlock -> ?????
		// Create new block with all pending transactions and mine it..
		let block = new Block(this.chain.length, Date.now(), this.memPool, latestBlock.hash, latestBlock.difficulty);
		block.mineBlock();

		// Add the newly mined block to the chain
		this.chain.push(block);

		// Reset the pending transactions and send the mining reward
		this.memPool = [
			new Transaction(0, this.coinbase, this.miningRewardAddress, false, this.miningReward, null, null)
		];
	}

	getBalanceOfAddress(address){
		// UTXO model
		let balance = 0; // you start at zero!

		console.log(this.chain);

		// Loop over each block and each transaction inside the block
		for(const block of this.chain){
			for(const trans of block.transactions){

				// If the given address is the sender -> reduce the balance
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}

				// If the given address is the receiver -> increase the balance
				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}
}

module.exports = Blockchain;
