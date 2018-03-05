import * as Debug from 'debug'
import { PluginV2, MoneyHandler } from 'ilp-compat-plugin'
import { AbstractBtpPlugin, IlpPluginBtpConstructorOptions, BtpPacket } from 'ilp-plugin-btp';

// const IlpPluginBtp: PluginV2 = AbstractBtpPlugin as any
const debug = Debug('ilp-pluginproxy')

namespace BtpConstants {
  export const TYPE_RESPONSE = 1
  export const TYPE_ERROR = 2
  export const TYPE_MESSAGE = 6
  export const TYPE_TRANSFER = 7
  export const MIME_APPLICATION_OCTET_STREAM = 0
  export const MIME_TEXT_PLAIN_UTF8 = 1
  export const MIME_APPLICATION_JSON = 2
}

export class PluginProxy {

  // Constructor
  private _plugin: PluginV2
  private _bridge: PluginV2

  // Cconnect
  constructor (plugin: PluginV2, bridge: PluginV2) {
    this._plugin = plugin
    this._bridge = bridge
  }

  async connect (): Promise<void> {

    this._plugin.registerDataHandler(async (data: Buffer): Promise<Buffer> => {
      return this._bridge.sendData(data)
    })
    this._plugin.registerMoneyHandler(async (amount: string): Promise<void> => {
      return this._bridge.sendMoney(amount)
    })

    await this._plugin.connect()

    this._bridge.registerDataHandler(async (data: Buffer): Promise<Buffer> => {
      return this._plugin.sendData(data)
    })
    this._bridge.registerMoneyHandler(async (amount: string): Promise<void> => {
      return this._plugin.sendMoney(amount)
    })

    await this._bridge.connect()
  }

  disconnect () {
    this._plugin.removeAllListeners()
    this._bridge.removeAllListeners()
    return Promise.all([
      this._plugin.disconnect(),
      this._bridge.disconnect()
    ])
  }

}

class IlpPluginBtp extends AbstractBtpPlugin {

  constructor (options: IlpPluginBtpConstructorOptions) {
    super(options)
  }

  sendMoney: MoneyHandler = async (amount: string) => {
    const response = await this._call('', {
      type: BtpConstants.TYPE_TRANSFER,
      requestId: await this._requestId(),
      data: {
        amount,
        protocolData: []
      }
    })

    if (response.type === BtpConstants.TYPE_ERROR) {
      return Promise.reject(response.data)
    }

    return Promise.resolve()
  }

  async _handleMoney (from: string, packet: BtpPacket) {

    if (!this._moneyHandler) {
      throw new Error('no money handler registered')
    }
    return this._moneyHandler(packet.data.amount!)
  }
}

export async function createBtpClientProxy (server: string, plugin: PluginV2): Promise<PluginProxy> {
  const btpClient = new IlpPluginBtp({ server })
  const proxy = new PluginProxy(plugin, btpClient)
  await proxy.connect()
  return proxy
}

export async function createBtpServerProxy (port: number, secret: string, plugin: PluginV2): Promise<PluginProxy> {
  const btpClient = new IlpPluginBtp({ listener: { port, secret } })
  const proxy = new PluginProxy(plugin, btpClient)
  await proxy.connect()
  return proxy
}
