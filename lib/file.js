var Fs = require('fs');
var Path = require('path');
var Mime = require('mime');
var Ejs = require('ejs');

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": Mime.lookup(Path.basename(filePath))}
  );
  response.end(fileContents);
}

exports.send404 = function(response) {
  send404(response);
};

exports.serveStatic = function(response, absPath) {
  // console.log("serveStatic: " + absPath);
  Fs.exists(absPath, function(exists) {
    if (exists) {
      Fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response);
        }
        else {
          sendFile(response, absPath, data);
        }
      });
    }
    else {
      send404(response);
    }
  });
};

exports.serveTemplate = function(response, absPath, context) {
  // console.log("serveTemplate: " + absPath);
  Fs.readFile(absPath, {encoding: 'utf8'}, function(err, data) {
    if (err) {
      send404(response);
    }
    else {
      var content = Ejs.render(data, {
        cache: false,
        filename: absPath,
        locals: context
      });
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    }
  });
};

exports.mkdirp = function(dirPath, mode, callback) {
  mkdirParent(dirPath, mode, callback);
};

function mkdirParent(dirPath, mode, callback) {
  // console.log('mkdirParent: ' + dirPath);
  Fs.mkdir(dirPath, mode, function(error) {
    if (error && error.errno === 34) {
      mkdirParent(Path.dirname(dirPath), mode, callback);
      mkdirParent(dirPath, mode, callback);
    }
    callback && callback(error);
  });
}