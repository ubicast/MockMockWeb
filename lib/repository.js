var InMemory = function() {
  this.data = {};
};

InMemory.prototype.save = function(siteJson, callback) {
  this.data[siteJson.name] = siteJson;
  callback();
};

InMemory.prototype.getSync = function(name) {
  return this.data[name];
};

exports.InMemory = InMemory;