const http = require('http')
const port = getPortFromArgv() || 5555
const axios = require('axios').default
const nodeUrl = require('url')

http
  .createServer(handleRequest)
  .listen(port)
  .on('error', console.error)
  .on('listening', () => { console.log(`node-proxy listening on port ${port}`) })


async function handleRequest(req, res) {

  makeRequest(req)
    .then(resp => {
      res.writeHead(
        resp.status,
        resp.statusText,
        {
          ...resp.headers,
          'access-control-allow-origin': '*',
          'access-control-allow-method': '*'
        },
      )
      res.end(resp.data)
    })
    .catch(err => {
      response = Object.keys(err.response || {}).length
        ? err.response
        : {
          status: 500,
          statusText: err.config ? err.config.message : err.message,
          data: err.config ? err.config.stack : err.stack
        }
      res.writeHead(response.status, response.statusText, response.headers)
      res.write(response.data)
      console.log(response.data)
      res.end()
    })
}

function getUrl(req) {
  return req.url.replace(/^\//, '')
}
function tapProps(obj, fn) {
  return Object.keys(obj)
    .reduce((acc, key) =>
      Object.assign(acc, { [fn(key)]: obj[key] })
      , {})
}
async function makeRequest(req) {
  const url = getUrl(req)
  const parsedURL = new nodeUrl.URL(url)
  const body = await getBody(req)
  const headersLower = tapProps(req.headers, String.prototype.toLowerCase.call.bind(String.prototype.toLowerCase))
  const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate",
    "user-agent": "PostmanRuntime/7.19.0",
    ...headersLower,
    // "Content-Type": "application/json",
    "postman-token": "ac001878-60d6-4025-b459-f130aee33a46,5b43bd89-d712-425a-86f5-36305280110f",
    "host": parsedURL.host,
    origin: parsedURL.origin,
    referer: parsedURL.origin,
    // "Content-Length": "92",
    "cookie": "aka-cc=IT; aka-ct=MILANO; aka-zp=; ak_bmsc=3B4D9B7EF54CEFCEA08B928C4980EC6A02150CA3FF3000009612445E6C1FE22D~plI3TZPf3zH5MVMmnnSwmj+QyKhrAlFsG+zB/xWsAPF5cpVrotbNmATW145/Gn1xkGlTQruui/US99ru2o609IjfIe68LgUpvIutQAYWwcLPu+eKN3k04L6BYVNgRJOcUE4TVLz0T/AECYi6k57NK+FYUY3lfELLxPqJACe4t42DUMUqvJcAVmmZLEGFeUpYtdDUu7Ya81nQAnwiYEim8e75WC09O6R0frFiFIoZpnb3Y=",
    "connection": "keep-alive",
    "cache-control": "no-cache"
  }
  return axios(url, {
    method: req.method,
    transformResponse: r => r,
    //responseType: 'arraybuffer',
    headers,
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