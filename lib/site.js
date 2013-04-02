var fs = require('fs');
var path = require('path');

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
