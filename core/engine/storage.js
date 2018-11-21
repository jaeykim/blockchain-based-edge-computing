var levelup = require('levelup')
var leveldown = require('leveldown')

// Storage class defines basic functionalities to implement storage interface.
class Storage {
	constructor(path) {
		this.db = levelup(leveldown(path));
	}

	load(address, callback) {
		// key:     hash value
		this.db.get(address, (err, value) => {
			if (err) {
				console.error(`A state of ${address} does not exist`);
                // if the state does not exist, hand over an empty object
				callback('{}');
			} else {
				console.log("[storage] value: " + value);
				console.log("[storage] typeof value: " + typeof(value));
				callback(value);
			}
		});
	}

	store(address, value, callback) {
		// key:     hash value
		// value:   program state
		console.log("[storage] value: " + value);
		this.db.put(address, value, err => {
			if (err) return console.error('Error: ', err);
			if (callback) callback();
		});
	}
}

module.exports = Storage;
