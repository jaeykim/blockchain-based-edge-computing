# lynx-blockchain

JavaScript based blockchain platform with smart contract runtime. Smart contract is run under the Google V8 JavaScript Engine. With the Edge programming interface layer, programmers and users of our service will be able to write and run their own smart contract with much ease.
In the back-end of the system, two architectural layers provides the functionalities:
1. Blockchain Layer
    Provides classical blockchain core interface with consensus layer and network layer. Defines the basic data structures of transaction and block, with block header, and chain representation from the viewpoint of the client.
2. Contract Layer
    Consists of multiple quasi-independent functional modules, each representing independent service layers the programming interface provides. Core logics are:
    *   Validation model
        Exploting Google V8 JavaScript Engine with abstract view of virtual machine to the user/programmer.
    *   Storage model
        Provides global database as a by-product of the state representation of the blockchain system.
    *   DAO model
        Contracts also have node address with abstract balance. Every client, who is a participant owns an address and secret key, can deposit and withdraw their tokens from the contracts.
