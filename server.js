var Http = require('http');
var Fs = require('fs');
var Path = require('path');
var Connect = require('connect');
var File = require('./lib/file');
var Site = require('./lib/site');
var Repository = require('./lib/repository');

var INTERNAL_PATH = '/_internal';

function internalPathMatch(request, path) {
  return request.url.match(new RegExp('^' + INTERNAL_PATH + path));
}

function internalAbsPath(path) {
  return '.' + INTERNAL_PATH + path;
}

// Initializing
var defaultLayout = Fs.readFileSync(
  internalAbsPath('/system/default-layout.html'), {encoding: 'utf8'});
var repository = new Repository.InMemory('default', defaultLayout);
var site = new Site(repository, Path.resolve(internalAbsPath('/system')));

// Start up the server
var app = Connect()
  .use(Connect.query())
  .use(Connect.bodyParser())
  .use(function(request, response){
    if (internalPathMatch(request, '/assets')) {
      File.serveStatic(response, '.' + request.url);
    }
    else if (internalPathMatch(request, '/settings')) {
      var borderPath = internalAbsPath('/system/settings/border-template.html');
      var command = request.url.replace(INTERNAL_PATH + '/settings', '');
      var context = { request: request, command: command };
      if (command == '/layout') {
        site.layout(request, response, context);
      }
      else if (command == '/layout/save') {
        site.repository.setLayout(request.body.layout, function() {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else if (command.match('^/contents/delete')) {
        var path = request.query['path'];
        site.repository.deleteContent(path, function() {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else {
        site.repository.listContentPaths(function(paths) {
          context.contentPaths = paths;
          File.serveTemplateWithBorder(
            response, internalAbsPath('/system/settings/contents.html'), borderPath, context);
        });
      }
    }
    else if (internalPathMatch(request, '/content')) {
      var command = request.url.replace(INTERNAL_PATH + '/content', '');
      if (command == '/save') {
        site.repository.setContent(request.body.path, request.body.content, function() {
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('');
        });
      }
      else {
        var urlPath = request.query['path'];
        if (urlPath) {
          site.repository.getContent(urlPath, function(content) {
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
      site.respond(request, response);
    }
  });
var port = process.env.PORT || 3000;
var server = Http.createServer(app).listen(port, function() {
  console.log("Server listening on port: " + port);
});


