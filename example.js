const crypto = require('crypto')
const IlpPluginBtp = require('ilp-plugin-btp')
const PSK2 = require('ilp-protocol-psk2') 
const PluginProxy = require('.').PluginProxy

const CONNECTOR_URL = 'ws://localhost:9090/plugins'

;(async () => {

  const receiverPlugin =  new IlpPluginBtp({ 
    server: `btp+ws://:receiver@localhost:7768`
  })
  const receiver = await PSK2.createReceiver({
    plugin: receiverPlugin,
    requestHandler: async (params) => {
      params.accept(Buffer.from('thanks!'))
      console.log(`Receiver got paid request with ${params.amount} attached and data: ${params.data.toString('utf8')}`)
      receiver.close()
    }
  })
  console.log('Receiver listening')

  // These would normally be passed through some application layer protcol
  const { destinationAccount, sharedSecret } = receiver.generateAddressAndSecret()
  console.log(`Use destinationAccount: ${destinationAccount} and sharedSecret: ${sharedSecret.toString('hex')}`)

  const senderPlugin = new IlpPluginBtp({ 
    server: `btp+wss://:sender@localhost:7768`
  })

  const senderProxy = new PluginProxy("alice", senderPlugin.sendData.bind(senderPlugin))
  senderPlugin.registerDataHandler(senderProxy.handleDataFromPlugin.bind(senderProxy))

  senderProxy.on('close', () => console.log('Proxy lost connection to connector.'))
  senderProxy.on('error', (err) => console.log(`Connection to connector threw an error: ${err.message}`))
  console.log('Created a proxy over BTP plugin connected to btp+wss://:sender@localhost:7768')
  
  await senderProxy.connect(CONNECTOR_URL, {
    // protocol?: string;
    handshakeTimeout: 5000,
    // perMessageDeflate?: boolean | PerMessageDeflateOptions;
    // localAddress?: string;
    // protocolVersion?: number;
    // headers?: { [key: string]: string };
    // origin?: string;
    // agent?: http.Agent;
    // host?: string;
    // family?: number;
    // checkServerIdentity?(servername: string, cert: CertMeta): boolean;
    // rejectUnauthorized?: boolean;
    // passphrase?: string;
    // ciphers?: string;
    // cert?: CertMeta;
    // key?: CertMeta;
    // pfx?: string | Buffer;
    // ca?: CertMeta;
    reconnectInterval: 5000
  })

  console.log(`Proxy connected to connector at ${CONNECTOR_URL}`)

})().catch(err => console.log(err))

