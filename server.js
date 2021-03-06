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

// Args
var reposType = process.argv.length >= 3 ? process.argv[2] : null;

// Initializing
var defaultLayout = Fs.readFileSync(
  internal('/system/default-layout.html'), {encoding: 'utf8'});
var repository = null;
if (reposType && reposType == 'mongo') {
  var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/mockmockweb';
  repository = new Repository.MongoDB('default', defaultLayout, mongoUri);
}
else {
  repository = new Repository.InMemory('default', defaultLayout);
}
console.log("Repository type: " + repository.type);
var site = new Site(repository, Path.resolve(internal('/system')));

// Start up the server
var app = Connect()
  .use(Connect.query())
  .use(Connect.bodyParser());

if (process.env.MMW_BASIC_USER) {
  app.use(Connect.basicAuth(function(user, password) {
    return user == process.env.MMW_BASIC_USER &&
      password == process.env.MMW_BASIC_PASSWORD;
  }));
}

app.use(function(request, response){
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
    else if (command == '/tools') {
      site.tools(request, response, context);
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


