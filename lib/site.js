var fs = require('fs');
var path = require('path');
var file = require('./file');

var PATH_LAYOUT = 'layout.html';
var PATH_PAGES = 'pages';
var _siteDir;

function absPath(relativePath) {
  return path.join(_siteDir, relativePath);
}

exports.init = function(siteDir, defaultLayout) {
  console.log('Initializing the site ...');
  _siteDir = siteDir;
  var layoutAbsPath = absPath(PATH_LAYOUT);
  if (!fs.existsSync(layoutAbsPath)) {
    fs.writeFileSync(layoutAbsPath, defaultLayout);
  }
};

exports.respond = function(request, response, content) {
  file.serveTemplate(response, absPath(PATH_LAYOUT), {
    request: request,
    content: content
  });
};

exports.layout = function(callback) {
  fs.readFile(absPath(PATH_LAYOUT), {encoding: 'utf8'}, function(err, data) {
    callback(err ? '' : data);
  });
};

exports.saveLayout = function(layout, callback) {
  fs.writeFile(absPath(PATH_LAYOUT), layout, callback);
};

exports.content = function(path, callback) {
  fs.readFile(absPath(PATH_PAGES + path), {encoding: 'utf8'}, function(err, data) {
    callback(err ? '' : data);
  });
};



