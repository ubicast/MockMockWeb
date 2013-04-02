var http = require('http');
var file = require('./lib/file');

var INTERNAL_PATH = '/_internal';

function internalPathMatch(request, path) {
  return request.url.match(new RegExp('^' + INTERNAL_PATH + path));
}

function internalAbsPath(path) {
  return '.' + INTERNAL_PATH + path;
}

var server = http.createServer(function(request, response) {
  if (internalPathMatch(request, '/assets')) {
    var absPath = '.' + request.url;
    file.serveStatic(response, absPath);
  }
  else if (internalPathMatch(request, '/admin')) {
    file.serveTemplate(response, internalAbsPath('/system/admin.html'));
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


