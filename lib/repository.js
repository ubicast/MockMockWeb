var InMemory = function(name, defaultLayout) {
  this.data = {
    name: name,
    layout: defaultLayout,
    contents: {}
  };
};

InMemory.prototype.getLayout = function(callback) {
  callback(this.data.layout ? this.data.layout : '');
};

InMemory.prototype.setLayout = function(layout, callback) {
  this.data.layout = layout;
  callback();
};

InMemory.prototype.listContentPaths = function(callback) {
  callback(Object.keys(this.data.contents).sort());
};

InMemory.prototype.getContent = function(path, callback) {
  var content = this.data.contents[path];
  callback(content ? content : '');
};

InMemory.prototype.setContent = function(path, content, callback) {
  this.data.contents[path] = content;
  callback();
};

InMemory.prototype.deleteContent = function(path, callback) {
  if (path) delete this.data.contents[path];
  callback();
};

exports.InMemory = InMemory;
