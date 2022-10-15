#!/usr/bin/env node
const createProxy = require('./index')
const port = Number(getFromArgv('port')) || 5555

createProxy(port)
  .then((port) => {
    console.log(`verybasic-http-proxy listening on port ${port}`)
  })
  .catch(console.log)

function getFromArgv(arg) {
  const args = process.argv.slice(2)
  const argIdx = args.findIndex(x => x === '--' + arg)
  if (~argIdx) {
    return args[argIdx + 1]
  }
}