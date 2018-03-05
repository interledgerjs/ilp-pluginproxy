declare module 'ilp-plugin-btp' {
  import { PluginV2, DataHandler, MoneyHandler } from 'ilp-compat-plugin'

  export class AbstractBtpPlugin implements PluginV2 {
    constructor(options: IlpPluginBtpConstructorOptions) 
    _moneyHandler: MoneyHandler
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnected: () => boolean;
    sendData: DataHandler;
    sendMoney: MoneyHandler;
    registerDataHandler: (handler: DataHandler) => void;
    deregisterDataHandler: () => void;
    registerMoneyHandler: (handler: MoneyHandler) => void;
    deregisterMoneyHandler: () => void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    eventNames(): Array<string | symbol>;
    listenerCount(type: string | symbol): number;
    _handleMoney (from: string, packet: BtpPacket) : Promise<void>
    _call (to: string, packet: BtpPacket) : Promise<BtpPacket>
    _requestId () : Promise<number>
  }

  export interface BtpPacket {
    requestId: number
    type: number
    data: {
      protocolData: Array<BtpSubProtocol>
      amount?: string
      code?: string
      name?: string
      triggeredAt?: string
      data?: string
    }
  }

  export interface BtpSubProtocol {
    protocolName: string
    contentType: number
    data: Buffer
  }

  export interface IlpPluginBtpConstructorOptions {
    server?: string,
    listener?: {
      port: number,
      secret: string
    },
    reconnectInterval?: number
  }
}