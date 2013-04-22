var mongoose = require('mongoose');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/test';

mongoose.connect(mongoUri);

var settingSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true
  },
  value: String
});
var Setting = mongoose.model('Setting', settingSchema);

var setting = new Setting({ key: 'name', value: 'Morita' });
setting.save(function (err) {
  if (err) throw err;
  console.log('saved');
});

Setting.findOne({key: 'name'}, function(err, setting) {
  if (err) throw err;
  if (setting) {
    console.log("setting: " + JSON.stringify(setting));
  }
  else {
    var setting = new Setting({ key: 'name', value: 'Morita' });
    setting.save(function (err) {
      if (err) throw err;
      console.log('saved');
    });
  }
//  mongoose.disconnect(function() {
//    console.log("end");
//  });
});

