var Http = require('http');
var Fs = require('fs');
var Path = require('path');
var Connect = require('connect');
var File = require('./lib/file');
var Site = require('./lib/site');

var INTERNAL_PATH = '/_internal';

function internalPathMatch(request, path) {
  return request.url.match(new RegExp('^' + INTERNAL_PATH + path));
}

function internalAbsPath(path) {
  return '.' + INTERNAL_PATH + path;
}

// Initialize the site
var defaultLayout = Fs.readFileSync(
  internalAbsPath('/system/default-layout.html'), {encoding: 'utf8'});
Site.init(internalAbsPath('/site-data'), defaultLayout);

// Start up the server
var app = Connect()
  .use(Connect.query())
  .use(Connect.bodyParser())
  .use(function(request, response){
    if (internalPathMatch(request, '/assets')) {
      var absPath = '.' + request.url;
      File.serveStatic(response, absPath);
    }
    else if (internalPathMatch(request, '/settings')) {
      var command = Path.relative(INTERNAL_PATH + '/settings', request.url);
      if (command == 'layout/save') {
        Site.saveLayout(request.body.layout, function() {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else {
        Site.layout(function(data) {
          File.serveTemplate(response, internalAbsPath('/system/settings.html'), {
            layout: data
          });
        });
      }
    }
    else if (internalPathMatch(request, '/content')) {
      var command = Path.relative(INTERNAL_PATH + '/content', request.url);
      if (command == 'save') {
        Site.saveContent(request.body.path, request.body.content, function(err) {
          if (err) console.log(err);
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else {
        var urlPath = request.query['path'];
        if (urlPath) {
          Site.content(urlPath, function(content) {
            File.serveTemplate(response, internalAbsPath('/system/content-editor.html'), {
              path: urlPath,
              content: content
            });
          });
        }
        else {
          File.send404(response);
        }
      }
    }
    else {
      Site.content(request.url, function(content) {
        Site.respond(request, response, content);
      });
    }
  });
var server = Http.createServer(app).listen(3000, function() {
  console.log("Server listening on port 3000.");
});


