/// <reference types="node" />
import { EventEmitter } from 'events';
export interface DataHandler {
    (data: Buffer): Promise<Buffer>;
}
export interface MoneyHandler {
    (amount: string): Promise<void>;
}
export default class MockPlugin extends EventEmitter {
    static readonly version: number;
    dataHandler: DataHandler;
    moneyHandler: MoneyHandler;
    exchangeRate: number;
    connected: boolean;
    constructor(exchangeRate: number);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    sendData(data: Buffer): Promise<Buffer>;
    sendMoney(amount: string): Promise<void>;
    registerDataHandler(handler: DataHandler): void;
    deregisterDataHandler(): void;
    registerMoneyHandler(handler: MoneyHandler): void;
    deregisterMoneyHandler(): void;
    defaultDataHandler(data: Buffer): Promise<Buffer>;
    defaultMoneyHandler(amount: string): Promise<void>;
}
