var http = require('http');
var fs = require('fs');
var path = require('path');
var connect = require('connect');
var file = require('./lib/file');
var site = require('./lib/site');

var INTERNAL_PATH = '/_internal';

function internalPathMatch(request, path) {
  return request.url.match(new RegExp('^' + INTERNAL_PATH + path));
}

function internalAbsPath(path) {
  return '.' + INTERNAL_PATH + path;
}

// Initialize the site
var defaultLayout = fs.readFileSync(
  internalAbsPath('/system/default-layout.html'), {encoding: 'utf8'});
site.init(internalAbsPath('/site-data'), defaultLayout);

// Start up the server
var app = connect()
  .use(connect.query())
  .use(connect.bodyParser())
  .use(function(request, response){
    if (internalPathMatch(request, '/assets')) {
      var absPath = '.' + request.url;
      file.serveStatic(response, absPath);
    }
    else if (internalPathMatch(request, '/settings')) {
      var command = path.relative(INTERNAL_PATH + '/settings', request.url);
      if (command == 'layout/save') {
        site.saveLayout(request.body.layout, function() {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else {
        site.layout(function(data) {
          file.serveTemplate(response, internalAbsPath('/system/settings.html'), {
            layout: data
          });
        });
      }
    }
    else if (internalPathMatch(request, '/content')) {
      var urlPath = request.query['path'];
      // console.log('urlPath: ' + urlPath);
      if (urlPath) {
        site.content(urlPath, function(content) {
          file.serveTemplate(response, internalAbsPath('/system/content-editor.html'), {
            path: urlPath,
            content: content
          });
        });
      }
      else {
        file.send404(response);
      }
    }
    else {
      site.content(request.url, function(content) {
        site.respond(request, response, content);
      });
    }
  });
var server = http.createServer(app).listen(3000, function() {
  console.log("Server listening on port 3000.");
});


