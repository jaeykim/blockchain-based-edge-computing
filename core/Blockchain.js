const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
var merkle = require('merkle');
var Block = require('./Block.js');
var Transaction = require('./Transaction.js');
const { coinbase, mining_reward_address, db_host, db_name } = require('./config.js');

// Blockchain class defines the data structure of the full (validating) node
// in the blockchain network, as well as the APIs to make use of the system.
class Blockchain {
    constructor(mining_reward_address) {
        // Blockchain
        this.chain = [this.createGenesisBlock()];

        // Reward for miner
        this.coinbase = coinbase;
        this.mining_reward = 100;
        this.mining_reward_address = mining_reward_address;

        // Memory Pool for storing pending transactions
        this.mem_pool = [
            new Transaction(0, this.coinbase, this.mining_reward_address, false, this.mining_reward, null, null)
        ];
    }

    createGenesisBlock(date) {
        if (date) return new Block(0, date, this.coinbase, undefined, undefined, undefined, "Genesis block", 3);
        else return new Block(0, new Date(), this.coinbase, undefined, undefined, undefined, "Genesis block", 3);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    createTransaction(transaction) {
        this.mem_pool.push(transaction);
    }

    // Debug
    getMemPoolState() {
        for (const tx in this.mem_pool) {
            console.log(this.mem_pool[tx]);
        }
    }

    minePendingTransactions() {
        let latestBlock = this.getLatestBlock(); // latestBlock -> ?????
        // Create new block with all pending transactions and mine it..
        let block = new Block(this.chain.length, Date.now(), this.mem_pool, latestBlock.hash, latestBlock.difficulty);
        block.mineBlock();

        // Add the newly mined block to the chain
        this.chain.push(block);

        // Reset the pending transactions and send the mining reward
        this.mem_pool = [
            new Transaction(0, this.coinbase, this.mining_reward_address, false, this.mining_reward, null, null)
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
