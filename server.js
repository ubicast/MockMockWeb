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

function internal(path) {
  return '.' + INTERNAL_PATH + path;
}

// Initializing
var defaultLayout = Fs.readFileSync(
  internal('/system/default-layout.html'), {encoding: 'utf8'});
var repository = new Repository.InMemory('default', defaultLayout);
var site = new Site(repository, Path.resolve(internal('/system')));

// Start up the server
var app = Connect()
  .use(Connect.query())
  .use(Connect.bodyParser())
  .use(function(request, response){
    if (internalPathMatch(request, '/assets')) {
      File.serveStatic(response, '.' + request.url);
    }
    else if (internalPathMatch(request, '/settings')) {
      var command = request.url.replace(INTERNAL_PATH + '/settings', '');
      var context = { request: request, command: command };
      if (command == '/layout') {
        site.layout(request, response, context);
      }
      else if (command == '/layout/save') {
        site.saveLayout(request, response);
      }
      else if (command.match('^/contents/delete')) {
        site.deleteContent(request, response);
      }
      else {
        site.listContentPaths(request, response, context);
      }
    }
    else if (internalPathMatch(request, '/content')) {
      var command = request.url.replace(INTERNAL_PATH + '/content', '');
      if (command == '/save') {
        site.saveContent(request, response);
      }
      else {
        site.content(request, response);
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


