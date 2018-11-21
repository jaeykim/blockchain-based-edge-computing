var fs = require('fs');
var SHA256 = require('crypto-js/sha256');
var exec = require('child_process').exec;
var Storage = require('./storage.js');
var fork = require('child_process').fork;
var path = require('path');
var debug_exec = require('debug')('engine:exec');

// Engine class defines simple execution logic of the blockchain node (client).
// Lynx blockchain uses Google V8 JavaScript Engine as backbone validating VM.
// Deploying smart contracts automatically calls deploy() funciton and try to
// run constructor for initiation. Execution of a function defined in a smart
// contract is done by sending transaction TO a contract address with approp-
// riate arguments.
class Engine {
    constructor(blockchain, dir = 'programs') {
        this.storage = new Storage(blockchain);
        this.dir = dir;
    }

    // TODO: Fail if a program has been deployed
    // TODO: Include txid to generate pgm address
    deploy(path) {
        let code = fs.readFileSync(path, 'utf8');
        let name = path.replace(/^.*[\\\/]/, '');
        // TODO: If it's better, convert address to path name with user address
        let address = SHA256(name + code).toString();
        console.log('name: ' + name);
        console.log('address: ' + address);

        if (!fs.existsSync(this.dir)){
            fs.mkdirSync(this.dir);
        }
        fs.writeFile(this.dir + '/' + address + '.js', code, function(err) {
            if (err) return console.error(err);
            console.log("Deploy completed");
        });

        /*
           programState.store(address, storage, function() {
           fs.writeFile('programs/' + address + '.js', code, function(err) {
           if (err) return console.error(err);
           console.log("Deploy completed");
           });
           });
        */
    }

    // execute - Called by transaction which specifies
    execute(address, msg, func) {
        let state = '{}';
        this.storage.load(address, (state) => {
            console.log("dir: " + this.dir);
            // msg test
            //msg = '{ "sender": "0x1234", "balance": 1000, "func": "_constructor", "args": [] }';
            //msg = '{ "sender": "0x1234", "balance": 1000, "func": "print", "args": [1,2,3] }';
            msg = '{ "sender": "0x1234", "balance": 1000, "func": "update", "args": [1] }';
            console.log("state:" + state);
            let pgm = fork(`./${this.dir}/${address}`, [], { silent: true, env: { state: state, msg: msg } });
            pgm.on('message', (msg) => {
                switch(msg.cmd) {
                    case 'storeValue':
                        console.log("storeValue");
                        console.log(msg.pair);
                        break;
                    case 'returnValue':
                        console.log("returnValue");
                        console.log(msg.value);
                        break;
                    case 'end':
                        console.log("end");
                        console.log("msg.state: " + msg.state);
                        this.storage.store(address, msg.state);
                        break;
                    default:
                        console.log("fallback");
                }
            });
            //pgm.stdout.pipe(process.stdout);
            pgm.stdout.on('data', function(data) {
                console.log('' + data);
            });
            pgm.stderr.on('data', function(data) {
                console.log('' + data);
            });
            pgm.on('end', function(state) {
                this.storage.store(address, state, () => {
                    console.log("end");
                });
            });
            pgm.on('close', function(code) {
                console.log('closing code: ' + code);
            });
        });
    }
}

module.exports = Engine;
