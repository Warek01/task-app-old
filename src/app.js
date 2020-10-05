const http = require('http'),
   fs = require('fs')

const server = http.createServer((req, res) => {

   if (req.url === '/') {

      res.writeHead(200, {'Content-Type': 'text/html'})
      fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(res)

   } else if (req.url.endsWith('.css') || req.url.endsWith('.js')) {

      fs.createReadStream(__dirname + req.url, 'utf8').pipe(res)

   } else if (req.url.endsWith('.png') || req.url.endsWith('.ico')|| req.url.endsWith('.jpg')) {

      fs.createReadStream(__dirname + req.url).pipe(res)
      console.log(req.url)

   } else if (req.url === '/tasks') {

      if (req.method === 'GET') {
         fs.createReadStream('/tasks.txt', 'utf8').pipe(res)

      } else if (req.method === 'POST') {
         fs.appendFile()

      }
   }

})

server.listen(8000)