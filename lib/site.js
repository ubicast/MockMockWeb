var fs = require('fs');
var path = require('path');
var file = require('./file');

var PATH_LAYOUT = 'layout.html';
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

exports.respond = function(request, response) {
  file.serveTemplate(response, absPath(PATH_LAYOUT), {request: request});
};

exports.layout = function(callback) {
  fs.readFile(absPath(PATH_LAYOUT), {encoding: 'utf8'}, function(err, data) {
    callback(err ? null : data);
  });
};

exports.saveLayout = function(layout, callback) {
  fs.writeFile(absPath(PATH_LAYOUT), layout, callback);
};


