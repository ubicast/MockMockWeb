var fs = require('fs');
var path = require('path');
var mime = require('mime');
var ejs = require('ejs');

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

exports.send404 = function(response) {
  send404(response);
};

exports.serveStatic = function(response, absPath) {
  // console.log("serveStatic: " + absPath);
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
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
  fs.readFile(absPath, {encoding: 'utf8'}, function(err, data) {
    if (err) {
      send404(response);
    }
    else {
      var content = ejs.render(data, {
        cache: false,
        filename: absPath,
        locals: context
      });
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    }
  });
};
