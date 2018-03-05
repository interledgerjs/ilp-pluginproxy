# ILP Plugin Proxy
> Javascript wrapper for plugins that expose the Ledger Plugin Interface v2.

[![CircleCI](https://circleci.com/gh/interledgerjs/ilp-protocol-psk2.svg?style=shield)](https://circleci.com/gh/interledgerjs/ilp-pluginproxy)
[![codecov](https://codecov.io/gh/interledgerjs/ilp-protocol-psk2/branch/master/graph/badge.svg)](https://codecov.io/gh/interledgerjs/ilp-pluginproxy)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The Plugin Proxy can be run as a stand-alone service. It is configured with two ILP plugins and provides a bridge between them registering the sendData and sendMoney functions on each as the handleMoney and handleData handlers on the other.

The package also provides a basic implementation of the BTP plugin which will:
 - handle BTP Transfer messages and pass the amount to the sendMoney of the other plugin.
 - handle calls to sendMoney by sending a BTP Transfer message

By using BTP as a standard messaging interface ILP implementations that are not written in JavaScript can use the proxy to get functionality provided by the various JS plugins already written.

## Installation

```shell
npm install ilp-pluginproxy
```

## API Documentation

See https://interledgerjs.github.io/ilp-pluginproxy

## Usage

### Creating a Proxy

```js
//TODO
```

Try it out by running the [example script](./example.js).
