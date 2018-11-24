const secp256k1 = require('elliptic-curve').secp256k1

function createAccount(seed) {
	let private_key = secp256k1.createHash(seed).toString('hex');
	let public_key = secp256k1.getPublicKey(private_key);
	return {private_key: private_key, public_key: public_key};
} 

var private_key = secp256k1.createHash('asdf').toString('hex');
console.log(`key: ${private_key}, length: ${private_key.length}`);

var public_key = secp256k1.getPublicKey(private_key);
console.log(`public_key: ${public_key}`);

var message = 'Hello world!';
var signedMsg = secp256k1.signMessage(message, private_key);
console.log(`signed message: ${signedMsg}`);

var signedHash = secp256k1.signHash(signedMsg, private_key);
console.log(`signed hash: ${signedHash}`);

console.log(secp256k1.verifyHash(signedMsg, signedHash, public_key));
