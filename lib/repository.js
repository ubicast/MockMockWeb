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



var Mongoose = require('mongoose');

var MongoDB = function(name, defaultLayout, mongoUri) {
  Mongoose.connect(mongoUri);
  var outer = this;
  MongoDB.Setting.findOne({ key: 'layout' }, function(err, layout) {
    if (err) throw err;
    if (!layout) {
      outer.setLayout(defaultLayout, function(err) {
        if (err) throw err;
        console.log('defaultLayout has been saved.');
      });
    }
  });
};

MongoDB.SettingSchema = new Mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: String
});
MongoDB.Setting = Mongoose.model('Setting', MongoDB.SettingSchema);

MongoDB.ContentSchema = new Mongoose.Schema({
  path: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: String
});
MongoDB.Content = Mongoose.model('Content', MongoDB.ContentSchema);

MongoDB.prototype.getLayout = function(callback) {
  MongoDB.Setting.findOne({ key: 'layout' }, function(err, layout) {
    if (err) throw err;
    callback(layout && layout.value ? layout.value : '');
  });
};

MongoDB.prototype.setLayout = function(layout, callback) {
  new MongoDB.Setting({ key: 'layout', value: layout }).save(callback);
};

MongoDB.prototype.listContentPaths = function(callback) {
  MongoDB.Content.find({})
    .select('path')
    .sort('path')
    .exec(function(err, contents) {
      var paths = [];
      contents.forEach(function(content) {
        paths.push(content.path);
      });
      callback(paths);
    });
};

MongoDB.prototype.getContent = function(path, callback) {
  MongoDB.Content.findOne({ path: path }, function(err, content) {
    if (err) throw err;
    callback(content && content.content ? content.content : '');
  });
};

MongoDB.prototype.setContent = function(path, content, callback) {
  new MongoDB.Content({ path: path, content: content }).save(callback);
};

MongoDB.prototype.deleteContent = function(path, callback) {
  MongoDB.Content.findOne({ path: path }, function(err, content) {
    if (err) throw err;
    if (content) content.remove(callback);
  });
};

exports.MongoDB = MongoDB;
