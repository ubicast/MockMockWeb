var Path = require('path');
var Ejs = require('ejs');
var File = require('./file');

var _systemPath;
var _settingsTemplatePath;

function absPath(path) {
  return Path.join(_systemPath, path);
}

function sendOk(response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('');
}

var Site = function(repository, systemPath) {
  this.repository = repository;
  _systemPath = systemPath;
  _settingsTemplatePath = absPath('settings/border-template.html');
};

Site.prototype.respond = function(request, response) {
  var rep = this.repository;
  var path = decodeURIComponent(request.url);
  rep.getContent(path, function(content) {
    rep.getLayout(function(layout) {
      var page = Ejs.render(layout, {
        cache: false,
        locals: {
          request: request,
          content: content
        }
      });
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(page);
    });
  });
};

Site.prototype.layout = function(request, response, context) {
  this.repository.getLayout(function(layout) {
    context.layout = layout;
    File.serveTemplateWithBorder(
      response, absPath('settings/site-layout.html'), _settingsTemplatePath, context);
  });
};

Site.prototype.saveLayout = function(request, response) {
  this.repository.setLayout(request.body.layout, function(err) {
    if (err) throw err;
    sendOk(response);
  });
};

Site.prototype.deleteContent = function(request, response) {
  var path = request.query['path'];
  this.repository.deleteContent(path, function() {
    sendOk(response);
  });
};

Site.prototype.listContentPaths = function(request, response, context) {
  this.repository.listContentPaths(function(paths) {
    context.contentPaths = paths;
    File.serveTemplateWithBorder(
      response, absPath('settings/contents.html'), _settingsTemplatePath, context);
  });
};

Site.prototype.content = function(request, response) {
  var urlPath = request.query['path'];
  if (urlPath) {
    this.repository.getContent(urlPath, function(content) {
      File.serveTemplate(response, absPath('content-editor.html'), {
        path: urlPath,
        content: content
      });
    });
  }
  else {
    File.send404(response);
  }
};

Site.prototype.saveContent = function(request, response) {
  this.repository.setContent(request.body.path, request.body.content, function(err) {
    if (err) throw err;
    sendOk(response);
  });
};

module.exports = Site;
