"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const IlpPacket = require("ilp-packet");
const bignumber_js_1 = require("bignumber.js");
const ILDCP = require("ilp-protocol-ildcp");
class MockPlugin extends events_1.EventEmitter {
    constructor(exchangeRate) {
        super();
        this.dataHandler = this.defaultDataHandler;
        this.moneyHandler = this.defaultMoneyHandler;
        this.exchangeRate = exchangeRate;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connected = true;
            return Promise.resolve();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connected = false;
            return Promise.resolve();
        });
    }
    isConnected() {
        return this.connected;
    }
    sendData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data[0] === IlpPacket.Type.TYPE_ILP_PREPARE) {
                const parsed = IlpPacket.deserializeIlpPrepare(data);
                if (parsed.destination === 'peer.config') {
                    return ILDCP.serializeIldcpResponse({
                        clientAddress: 'test.receiver',
                        assetScale: 9,
                        assetCode: 'ABC'
                    });
                }
                const newPacket = IlpPacket.serializeIlpPrepare(Object.assign({}, parsed, { amount: new bignumber_js_1.default(parsed.amount).times(this.exchangeRate).toString(10) }));
                return this.dataHandler(newPacket);
            }
            else {
                return this.dataHandler(data);
            }
        });
    }
    sendMoney(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moneyHandler(amount);
        });
    }
    registerDataHandler(handler) {
        this.dataHandler = handler;
    }
    deregisterDataHandler() {
        this.dataHandler = this.defaultDataHandler;
    }
    registerMoneyHandler(handler) {
        this.moneyHandler = handler;
    }
    deregisterMoneyHandler() {
        this.moneyHandler = this.defaultMoneyHandler;
    }
    defaultDataHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return IlpPacket.serializeIlpReject({
                code: 'F02',
                triggeredBy: 'example.mock-plugin',
                message: 'No data handler registered',
                data: Buffer.alloc(0)
            });
        });
    }
    defaultMoneyHandler(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
MockPlugin.version = 2;
exports.default = MockPlugin;
//# sourceMappingURL=plugin.js.map