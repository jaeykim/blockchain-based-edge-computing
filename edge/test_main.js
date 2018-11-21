const mainUtils = require('./mainUtils.js');
const fork = require('child_process').fork

let child = mainUtils.runSmartContract('test.js')
if (!child){
	console.log('err');
}

