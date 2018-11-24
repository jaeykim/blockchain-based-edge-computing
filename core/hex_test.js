var x = '0123456789abcdef'.split('').map((v,i,a) => {
	  return a[Math.floor(Math.random()*16)]
}).join('');

console.log(x);

function generateKey(seed) {
	let hexChar = '0123456789abcdef';
	let key = [];
	for (let i = 0; i < 64; i++) {
		key[i] = hexChar[Math.floor(Math.random() * 16)];
	}
	return key.join('');
}

console.log(generateKey(1));
