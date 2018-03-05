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
const Debug = require("debug");
const ilp_plugin_btp_1 = require("ilp-plugin-btp");
const debug = Debug('ilp-pluginproxy');
var BtpConstants;
(function (BtpConstants) {
    BtpConstants.TYPE_RESPONSE = 1;
    BtpConstants.TYPE_ERROR = 2;
    BtpConstants.TYPE_MESSAGE = 6;
    BtpConstants.TYPE_TRANSFER = 7;
    BtpConstants.MIME_APPLICATION_OCTET_STREAM = 0;
    BtpConstants.MIME_TEXT_PLAIN_UTF8 = 1;
    BtpConstants.MIME_APPLICATION_JSON = 2;
})(BtpConstants || (BtpConstants = {}));
class PluginProxy {
    constructor(plugin, bridge) {
        this._plugin = plugin;
        this._bridge = bridge;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this._plugin.registerDataHandler((data) => __awaiter(this, void 0, void 0, function* () {
                return this._bridge.sendData(data);
            }));
            this._plugin.registerMoneyHandler((amount) => __awaiter(this, void 0, void 0, function* () {
                return this._bridge.sendMoney(amount);
            }));
            yield this._plugin.connect();
            this._bridge.registerDataHandler((data) => __awaiter(this, void 0, void 0, function* () {
                return this._plugin.sendData(data);
            }));
            this._bridge.registerMoneyHandler((amount) => __awaiter(this, void 0, void 0, function* () {
                return this._plugin.sendMoney(amount);
            }));
            yield this._bridge.connect();
        });
    }
    disconnect() {
        this._plugin.removeAllListeners();
        this._bridge.removeAllListeners();
        return Promise.all([
            this._plugin.disconnect(),
            this._bridge.disconnect()
        ]);
    }
}
exports.PluginProxy = PluginProxy;
class IlpPluginBtp extends ilp_plugin_btp_1.AbstractBtpPlugin {
    constructor(options) {
        super(options);
        this.sendMoney = (amount) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this._call('', {
                type: BtpConstants.TYPE_TRANSFER,
                requestId: yield this._requestId(),
                data: {
                    amount,
                    protocolData: []
                }
            });
            if (response.type === BtpConstants.TYPE_ERROR) {
                return Promise.reject(response.data);
            }
            return Promise.resolve();
        });
    }
    _handleMoney(from, packet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._moneyHandler) {
                throw new Error('no money handler registered');
            }
            return this._moneyHandler(packet.data.amount);
        });
    }
}
function createBtpClientProxy(server, plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        const btpClient = new IlpPluginBtp({ server });
        const proxy = new PluginProxy(plugin, btpClient);
        yield proxy.connect();
        return proxy;
    });
}
exports.createBtpClientProxy = createBtpClientProxy;
function createBtpServerProxy(port, secret, plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        const btpClient = new IlpPluginBtp({ listener: { port, secret } });
        const proxy = new PluginProxy(plugin, btpClient);
        yield proxy.connect();
        return proxy;
    });
}
exports.createBtpServerProxy = createBtpServerProxy;
//# sourceMappingURL=index.js.map