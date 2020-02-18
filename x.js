var http = require("https");

var options = {
  "method": "POST",
  "hostname": "origin-uat-dmp.ray-ban.com",
  // "hostname": "acceptance.ray-ban.com",
  // "path": "https://acceptance.ray-ban.com/services/search-stores",
  "path": "https://origin-uat-dmp.ray-ban.com/services/search-stores",
  "headers": {
    // "Accept": "application/json",
    "Content-Type": "application/json",
    //"Content-Type": "text/plain",
    //"User-Agent": "PostmanRuntime/7.19.0",
    "Accept": "*/*",
    "Cache-Control": "no-cache",
    // "Postman-Token": "ac001878-60d6-4025-b459-f130aee33a46,5b43bd89-d712-425a-86f5-36305280110f",
    "Host": "origin-uat-dmp.ray-ban.com",
    //"Accept-Encoding": "gzip, deflate",
    // "Content-Length": "92",
    // "Cookie": "aka-cc=IT; aka-ct=MILANO; aka-zp=; ak_bmsc=3B4D9B7EF54CEFCEA08B928C4980EC6A02150CA3FF3000009612445E6C1FE22D~plI3TZPf3zH5MVMmnnSwmj+QyKhrAlFsG+zB/xWsAPF5cpVrotbNmATW145/Gn1xkGlTQruui/US99ru2o609IjfIe68LgUpvIutQAYWwcLPu+eKN3k04L6BYVNgRJOcUE4TVLz0T/AECYi6k57NK+FYUY3lfELLxPqJACe4t42DUMUqvJcAVmmZLEGFeUpYtdDUu7Ya81nQAnwiYEim8e75WC09O6R0frFiFIoZpnb3Y=",
    //"Connection": "keep-alive",
  }
};

var req = http.request(options, function (res) {
  var chunks = '';

  res.on("data", function (chunk) {
    //console.log(chunk)
    chunks+=chunk;
  });

  res.on("end", function () {
    //var body = Buffer.concat(chunks);
    // console.log(body.toString());
    console.log(chunks.toString())
    //require('fs').writeFile('./out.txt', chunks, {encoding:'utf8'},console.log)
  });
});
req.on('error', console.log)
req.write(JSON.stringify({
  ctryid: 27,
  // lat: 28.485274,
	// lng:-81.43133,
	// km: 2
}));
req.end();