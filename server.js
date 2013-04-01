var http = require('http');

var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('URL: ' + request.url);
  response.end();
});

server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});
