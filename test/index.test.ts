import 'mocha'
import * as sinon from 'sinon'
import { assert } from 'chai'
import * as PluginServer from '../src/index'

describe('Exports', function () {
  it('exports the sender and receiver functions directly', function () {
    assert.typeOf(PluginServer, 'function')
  })

})
