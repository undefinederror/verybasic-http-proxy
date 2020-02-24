const http = require('http')
const axios = require('axios').default
const nodeUrl = require('url')
const headersACA = {
  'access-control-allow-headers': '*',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': '*',
}

module.exports = function createProxy(port) {
  http
    .createServer(handleRequest)
    .listen(port)
    .on('error', console.error)
    .on('listening', () => { console.log(`verybasic-http-proxy listening on port ${port}`) })
}

function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(
      200,
      'go on',
      headersACA
    )
    res.end()
    return
  }

  makeRequest(req)
    .then(resp => {
      res.writeHead(
        resp.status,
        resp.statusText,
        {
          ...resp.headers,
          ...headersACA,
          'content-length': resp.data.length
        },
      )
      res.write(resp.data)
      res.end()
    })
    .catch(err => {
      resp = Object.keys(err.response || {}).length
        ? err.response
        : {
          status: 500,
          statusText: err.config ? err.config.message : err.message,
          data: err.config ? err.config.stack : err.stack
        }
      res.writeHead(
        resp.status,
        resp.statusText,
        {
          ...resp.headers,
          ...headersACA
        }
      )
      res.write(resp.data)
      res.end()
    })
}

async function makeRequest(req) {
  const url = getUrl(req)
  const parsedURL = new nodeUrl.URL(url)
  const body = await getBody(req)
  const reqHeaders = tapProps(req.headers, String.prototype.toLowerCase.call.bind(String.prototype.toLowerCase))
  const headers = {
    accept: "*/*",
    connection: "keep-alive",
    'cache-control': "no-cache",
    ...reqHeaders,
    host: parsedURL.host,
    origin: parsedURL.origin,
    referer: parsedURL.origin,
  }
  return axios(url, {
    method: req.method,
    transformResponse: r => r,
    responseType: 'arraybuffer',
    headers,
    data: body
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
