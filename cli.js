#!/usr/bin/env node
const createProxy = require('./index')
const port = Number(getFromArgv('port')) || 5555

createProxy(port)

function getFromArgv(arg) {
  const args = process.argv.slice(2)
  const argIdx = args.findIndex(x => x === '--' + arg)
  if (~argIdx) {
    return args[argIdx + 1]
  }
}