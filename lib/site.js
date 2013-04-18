var Ejs = require('ejs');

var Site = function(data, repository) {
  this.data = data;
  this.repository = repository;
};

Site.newData = function(name, defaultLayout) {
  return {
    name: name,
    layout: defaultLayout,
    contents: {}
  };
};

Site.prototype.save = function(callback) {
  this.repository.save(this.data, callback);
};

Site.prototype.getLayout = function() {
  return this.data.layout ? this.data.layout : '';
};

Site.prototype.setLayout = function(layout) {
  this.data.layout = layout;
};

Site.prototype.listContentPaths = function() {
  return Object.keys(this.data.contents).sort();
};

Site.prototype.getContent = function(path) {
  var content = this.data.contents[path];
  return content ? content : '';
};

Site.prototype.setContent = function(path, content) {
  this.data.contents[path] = content;
};

Site.prototype.deleteContent = function(path) {
  delete this.data.contents[path];
};

Site.prototype.respond = function(request, response) {
  var content = this.getContent(decodeURIComponent(request.url));
  var page = Ejs.render(this.getLayout(), {
    cache: false,
    locals: {
      request: request,
      content: content
    }
  });
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(page);
};

module.exports = Site;
