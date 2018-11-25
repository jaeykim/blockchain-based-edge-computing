const IPFS = require('ipfs');

const ipfs = new IPFS();

const data = 'Hello from IPFS, <YOUR NAME HERE>!'

// Once the ipfs node is ready
ipfs.once('ready', async () => {
    console.log('IPFS node is ready! Current version: ' + (await ipfs.id()).agentVersion)

    // convert your data to a Buffer and add it to IPFS
    console.log('Data to be published: ' + data)
    const files = await ipfs.files.add(ipfs.types.Buffer.from(data))

    // 'hash', known as CID, is a string uniquely addressing the data
    // and can be used to get it again. 'files' is an array because
    // 'add' supports multiple additions, but we only added one entry
    const cid  = files[0].hash
    console.log('Published under CID: ' + cid)

    // read data back from IPFS: CID is the only identifier you need!
    const dataFromIpfs = await ipfs.files.cat(cid)
    console.log('Read back from IPFS: ' + String(dataFromIpfs))

    // Compatibility layer: HTTP gateway
    console.log('Bonus: open at one of public HTTP gateways: https://ipfs.io/ipfs/' + cid)

    ipfs.stop();
})

/*
ipfs.on('ready', async () => {
    const version = await ipfs.version()

    console.log('Version:', version.version)

    const filesAdded = await ipfs.files.add({
        path: 'hello.txt',
        content: Buffer.from('Hello World 101')
    })

    const validCID = 'QmQ2r6iMNpky5f1m4cnm3Yqw8VSvjuKpTcK1X7dBR1LkJF'
    ipfs.ls(validCID, function (err, files) {
        files.forEach((file) => {
            console.log('file path: ' + file.path)
        })
    })
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

    const fileBuffer = await ipfs.files.cat(filesAdded[0].hash)

    console.log('Added file contents:', fileBuffer.toString())

})
*/
