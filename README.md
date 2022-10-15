# verybasic-http-proxy

A very basic http proxy in nodejs.

You may use it to quickly get around CORS limitations for APIs you want to query from browser

## Installation

```
npm i verybasic-http-proxy
```

## Starting the proxy

### using the cli

with global install

```
verybasic-http-proxy --port 5555
```
with local install
```
npx verybasic-http-proxy --port 5555
```
via package.json scripts
```package.json
"scripts": {
    "proxy": "verybasic-http-proxy --port 5555"
}
```
### from script

```js
const createProxy = require('verybasic-http-proxy')
createProxy(5555)
```

Port is optional, default is 5555


## Forwarding requests
Prepend the proxy url to your request, for instance
```
http://localhost:5555/https://www.someapi.com?par=val
```
All your request headers and data are forwarded. 

The only hardcoded request headers are Host, Origin and Referer so to match the requested api.

Response headers will include 
```
 access-control-allow-headers: *
 access-control-allow-origin: *
 access-control-allow-methods: *
```


