var Fs = require('fs');
var Path = require('path');
var File = require('./file');

var PATH_LAYOUT = 'layout.html';
var PATH_PAGES = 'pages';
var _siteDir;

function absPath(relativePath) {
  return Path.join(_siteDir, relativePath);
}

exports.init = function(siteDir, defaultLayout) {
  console.log('Initializing the site ...');
  _siteDir = siteDir;
  File.mkdirp(_siteDir, '0777', function(err) {
    var layoutAbsPath = absPath(PATH_LAYOUT);
    if (!Fs.existsSync(layoutAbsPath)) {
      Fs.writeFileSync(layoutAbsPath, defaultLayout);
    }
  });
};

exports.respond = function(request, response, content) {
  File.serveTemplate(response, absPath(PATH_LAYOUT), {
    request: request,
    content: content
  });
};

exports.layout = function(callback) {
  Fs.readFile(absPath(PATH_LAYOUT), {encoding: 'utf8'}, function(err, data) {
    callback(err ? '' : data);
  });
};

exports.saveLayout = function(layout, callback) {
  Fs.writeFile(absPath(PATH_LAYOUT), layout, callback);
};

exports.content = function(path, callback) {
  var filePath = urlToFileAbsPath(path);
  Fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
    callback(err ? '' : data);
  });
};

exports.saveContent = function(path, content, callback) {
  var filePath = urlToFileAbsPath(path);
  File.mkdirp(Path.dirname(filePath), '0777', function(err) {
    // if (err) throw err;
    Fs.writeFile(filePath, content, callback);
  });
};

function urlToFileAbsPath(path) {
  if (path.match(new RegExp('/$'))) {
    return absPath(PATH_PAGES + path + '_index');
  }
  else {
    // TODO needs to url-encode the file name
    return absPath(PATH_PAGES + path);
  }
}



