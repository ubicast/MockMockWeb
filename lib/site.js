var Ejs = require('ejs');

var Site = function(repository) {
  this.repository = repository;
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

module.exports = Site;
