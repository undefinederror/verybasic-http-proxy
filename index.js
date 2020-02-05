const http = require('http')
const promisify = require('util').promisify
// const port = process.argv
const axios = require('axios').default

http.createServer(function (req, res) {
  // res.write(req.method)
  // res.write('\n')
  // res.write(JSON.stringify(req.headers,null,2))
  // res.write('\n')
  makeRequest(getUrl(req), req.method)
    .then(resp => {
      res.writeHead(
        resp.status,
        resp.statusText,
        resp.headers
      )
      res.write(JSON.stringify(resp.data))
      res.end()
    })
}).listen(5555)


function getUrl(req) {
  return req.url.replace(/^\//, '')
}

async function makeRequest(url, method, headers) {
  const res = await axios({
    url,
    method,
  })
  return res
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
