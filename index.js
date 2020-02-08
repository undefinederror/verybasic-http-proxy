const http = require('http')
const port = getPortFromArgv() || 5555
const axios = require('axios').default

http
  .createServer(handleRequest)
  .listen(port)
  .on('error', console.error)
  .on('listening', () => { console.log(`node-proxy listening on port ${port}`) })


async function handleRequest(req, res) {
  const body = await getBody(req)

  makeRequest(getUrl(req), req.method, body)
    .then(resp => {
      res.writeHead(
        resp.status,
        resp.statusText,
        {
          ...resp.headers,
          'access-control-allow-origin': '*'
        },
      )
      res.end(resp.data)
    })
    .catch(err => {
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.write(err.toString())
      res.end()
    })
}

function getUrl(req) {
  return req.url.replace(/^\//, '')
}

function makeRequest(url, method, body) {
  return axios(url, {
    method,
    transformResponse: r => r,
    responseType: 'arraybuffer',
    data: body
  })
}

function getBody(req) {
  return new Promise((rsv, rjt) => {
    let chunks = ''
    req.setEncoding('utf8')
    req.on('data', chunk => {
      chunks += chunk
    })
    req.on('end', () => {
      rsv(chunks)
    })
  })
}

function getPortFromArgv() {
  const args = process.argv.slice(2)
  const portIdx = args.findIndex(x => x === '--port')
  if (~portIdx && Number(args[portIdx + 1])) {
    return args[portIdx + 1]
  }
}