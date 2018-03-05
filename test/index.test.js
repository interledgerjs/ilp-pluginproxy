"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const PluginServer = require("../src/index");
describe('Exports', function () {
    it('exports the sender and receiver functions directly', function () {
        chai_1.assert.typeOf(PluginServer, 'function');
    });
});
//# sourceMappingURL=index.test.js.map