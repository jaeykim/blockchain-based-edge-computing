var Transaction = require('../core/Transaction.js');
var Blockchain = require('../core/Blockchain.js');
var Block = require('../core/Block.js')
var jot = require('json-over-tcp');
var Promise = require('promise');

class Basenode {
    constructor(blockchain, port=3030, firstPeerNode=undefined){
        //TODO peers는 노드정보여야 한다.
        this.peers = [];
        this.blockchain = blockchain;
        if (firstPeerNode!=undefined){
            this.peers.push(firstPeerNode);
        }
        this.port = port;
    }

    createServer(){
        console.log("create Server");
        let server = jot.createServer();
        server.on('connection', ((socket)=>{
            //console.log('socket connected>>' + socket.remoteAddress + ':' + socket.remotePort);
            //console.log('socket connected>>' + socket.localAddress + ':' + socket.localPort);

            socket.on('data',((data)=>{
                console.log(this.port+" : new connection");
                let clientNode = new Node(socket.remoteAddress, data.port);
                for(let i in this.peers){
                    if(JSON.stringify(this.peers[i]) == JSON.stringify(clientNode)){
                        this.peers.push(clientNode);
                    }
                }
                switch (data.msgType){
                    case 'addr':
                        for(const node in data.addr_list){
                            //this.connectPeer(node);
                            //TODO
                        }
                        break;
                    case 'inv':
                        replyInv.call(this, clientNode, data.inventory);
                        /*
                        var replyInvBind= replyInv.bind(this);
                        replyInvBind(socket, data.inventory);
                        */
                        break;
                    case 'get':
                        break;
                    case 'getAddr':
                        addr(socket);
                        break;
                    case 'getdata':
                        replyGetData.call(this,clientNode, data.inventory);
                        break;
                    case 'getblocks':
                        replyGetBlock.call(this,clientNode, data.inventory);
                        break;
                    case 'tx':
                        pushTx.call(this,clientNode, data.transactions);
                        break;
                    case 'block':
                        console.log("cannot get data.blocks");
                        pushBlock.call(this,clientNode, data.blocks);
                        break;
                    default:
                        break;
                }

            }).bind(this));

            socket.on('end', ()=>{
                console.log('socket disconnected');
            });

            function replyInv(node, inventory){
                let txsInv = [];
                let blocksInv = [];
                for(const i in inventory){
                    let flag = false;
                    const inv = inventory[i];
                    const hash = inv.hash;
                    switch(inv.type){
                        case 'msg_tx':
                            console.log(this.port+' : get msg_tx');
                            console.log(this.blockchain.memPool.length);
                            for(let j in this.blockchain.memPool){
                                console.log(j);
                                const tx = this.blockchain.memPool[j];
                                if(tx.calculateHash == hash){
                                    flag = true;
                                    break;
                                }
                            }
                            if(flag == false){
                                txsInv.push(inv);
                            }
                            break;
                        case 'msg_block':
                            console.log(this.port+' : get msg_block in');
                            for(const j in this.blockchain.chain){
                                if(this.blockchain.chain[j].hash == hash){
                                    console.log(this.port+" : find matching block");
                                    flag = true;
                                    break;
                                }
                            }
                            if(flag == false){
                                blocksInv.push(inv);
                            }
                            flag = false;
                            break;
                        default:
                            break;
                    }
                }

                if(txsInv.length!=0){
                    getData.call(this, node, txsInv);
                }

                if(blocksInv.length!=0){
                    console.log(this.port+" : call getblocks");
                    getBlocks.call(this, node, blocksInv);
                }

            }

            function replyGetData(node, inventory){
                let txs = [];
                for(const i in this.blockchain.memPool){
                    const tx = this.blockchain.memPool[i];
                    const hash = tx.calculateHash();
                    const inv = new Inventory('msg_tx',hash);
                    for(let i in inventory){
                        if(JSON.stringify(inventory[i])==JSON.stringify(inv)){
                            txs.push(tx);
                        }
                    }
                }
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'tx', 'transactions':txs, 'port':this.port})});
            }

            function replyGetBlock(node, inventory){
                console.log(this.port+ " : replyGetBlock");
                let blocks = [];
                for(const i in this.blockchain.chain){
                    const block = this.blockchain.chain[i];
                    const hash = block.calculateHash();

                    const inv = {'type' : 'msg_block', 'hash' : hash};

                    for(let j in inventory){
                        if(JSON.stringify(inventory[j]) == JSON.stringify(inv)){
                            blocks.push(block);
                        }
                    }
                }
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'block', 'blocks':blocks, 'port':this.port})});
            }

            function pushTx(node, transactions){
                let invs = [];
                for(const i in transactions){
                    let inFlag = true;
                    const tx = transactions[i];
                    for(let j in this.blockchain.memPool){
                        if(JSON.stringify(this.blockchain.memPool[j]) == JSON.stringify(tx)){
                            inFlag = false;
                        }
                    }
                    if(inFlag){
                        const newTx = new Transaction(tx.type, tx.nonce, tx.fromAddress, tx.toAddress, tx.isToContract, tx.value, tx.signature, tx.data);
                        this.blockchain.createTransaction(newTx);
                        let inv = new Inventory('msg_tx',newTx.calculateHash());
                        invs.push(inv);
                    }
                }

                if(invs.length!=0){
                    console.log(this.port+" : call sendinv");
                    this.sendInv.call(this, invs, node);
                }
            }

            function pushBlock(node, blocks){
                //console.log(blocks[0]);
                let invs = [];
                for(let i in blocks){
                    let inFlag = true;
                    const block = blocks[i];
                    for(let j in this.blockchain.chain){
                        if(JSON.stringify(this.blockchain.chain[j]) == JSON.stringify(block)){
                            inFlag = false;
                        }
                    }
                    if(inFlag){
                        const newBlock = new Block(block.index, block.timestamp, block.transactions, block.previousHash, block.nonce, block.previousDifficulty);
                        this.blockchain.chain.push(newBlock);
                        let inv = new Inventory('msg_block', block.hash);
                        invs.push(inv);
                    }
                }

                if(invs.length!=0){
                    console.log(this.port+" : call sendinv");
                    this.sendInv.call(this, invs, node);
                }
            }

            function addr(node){
                //TODO socket port and listener port is different!
                let nodes = [];
                for (let i in this.peers){
                    if(this.peers[i]!=node){
                        nodes.push(this.peers[i]);
                    }
                }
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'addr', 'addr_list':nodes, 'port':this.port})});
            }

            function getData(node, inventory){
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'getdata', 'inventory':inventory, 'port':this.port})});
            }

            function getBlocks(node, inventory){
                console.log(this.port+" : real getBlock, inv : "+inventory[0].hash);
                //console.log("with socket, "+socket.remotePort);
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'getblocks', 'inventory':inventory, 'port':this.port})});
                //this.connectPeer(node).write({'msgType':'getblocks', 'inventory':inventory});
            }

            function notFound(node, data){
                this.connectPeer(node).then((socket)=>{socket.write({'msgType':'notfound', 'inventory':data, 'port':this.port})});
            }

            function getHeaders(node){

            }
        }).bind(this));



        server.listen(this.port, function(){
            console.log('Server listening : ' + JSON.stringify(server.address()));
            server.on('close', function(){
                console.log('Server terminated');
            });
            server.on('error', function(err){
                console.log('Server error : ', JSON.stringify(err));
            });
        });
    }

    connectPeer(node){
        return new Promise((resolve, reject)=>{
            let socket = new jot.Socket();
            socket.connect(node.port, node.ip, (()=>{
                //socket.localPort = this.port;
                console.log(this.port+" : connect to "+socket.remotePort);
                resolve(socket);
            }).bind(this));
        })
    }


    sendInv(inventory, node = undefined){
        console.log(this.port+" : send inv message");
        for(let i in this.peers){
            if(this.peers[i] != node){
                this.connectPeer(this.peers[i]).then((socket)=>{socket.write({'msgType':'inv', 'inventory':inventory, 'port':this.port})});
            }
        }
    }
}

class Inventory{
    constructor(type, hash){
        if(type == 'error' ||
           type == 'msg_tx' ||
           type == 'msg_block'){
               this.type = type;
           }
        this.hash = hash;
    }
}

class Node{
    constructor(ip, port){
        this.ip = ip;
        this.port = port;
    }
}

module.exports = {Basenode, Inventory, Node};
