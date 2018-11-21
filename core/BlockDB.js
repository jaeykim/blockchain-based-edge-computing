var levelup = require('levelup');
var leveldown = require('leveldown');
var Block = require('./Block.js');
const blockDB_debug = require('debug')('blockDB');

const chunk = 100;

// Storage class defines basic functionalities to implement storage interface.
class BlockDB {
	constructor(path) {
		this.blockDB = levelup(leveldown(path));
	}

	// TODO: JSON.parse?
	getBlockByHeight(height) {
		let blockNum = height / chunk;
		this.blockDB.get(blockNum, (err, blockChunk) => {
			return blockChunk[blockNum % chunk];
		});
	}

	getBlockByHash(hash) {
		this.blockDB.get('latest', (err, blockChunk) => {
			while (blockChunk >= 0) {
				for (for block in blockChunk) {
					if (block.getHash() == hash) return block;
				}
			}
			blockDB_debug("Cannot find block with " + hash);
			return undefined;
		});
	}
	
	getBalance(address) {
		this.blockDB.get(address, (err, balance) => {
			return balance;
		}
	}
}

module.exports = BlockDB;
