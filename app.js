const http = require('http')

http.createServer(function(req, res) {
  res.write("Bok Bok Palm Coast")
  res.end()
}).listen(3000)

console.log('server started')
