JavaScript engine for JavaScript Smart Contract
=====================

This is an JavaScript Smart Contract engine using node.js with V8 JavaScript engine.
V8 runs a smart contract and do a state transition by specific transactions.


## How to use?

### Instructions

// TODO: convert balance to another term
A message(msg) have to have properties which are sender, balance, func, and args.
```JSON
msg = {
    sender:     sender address,
    balance:    gas limit,
    func:       function id,
    args:       argument list
    }
```

### Smart Contract

Smart Contract should include libx.js library and extends it by the contract's parent class.

```Javascript
var Libx = require('./libx.js');

Class myContract extends Libx {
    _constructor() {
    }

    do() {
    }
}

new myContract().apply();
```

// TODO: introduce a flag to execute constructor only once
We define a keyworkd of constructor for JavaScript smart contract as _constructor

Smart contract have to define methods to be called by a message
