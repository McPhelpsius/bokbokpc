const http = require('http')

http.createServer(function(req, res) {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
}).listen(3000)

console.log('server started')
