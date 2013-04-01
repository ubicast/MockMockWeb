var http = require('http');
var staticFile = require('./lib/static_file');

var INTERNAL_PATH = '/_internal';

var server = http.createServer(function(request, response) {
  if (request.url.match(new RegExp('^' + INTERNAL_PATH + '/assets'))) {
    var absPath = '.' + request.url;
    console.log("Serving a static file: " + absPath);
    staticFile.serveStatic(response, absPath);
  }
  else {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('URL: ' + request.url);
    response.end();
  }
});

server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});


