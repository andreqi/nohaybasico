var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utils = require('../utils');

var ContactSchema = new Schema({
  from: String,
  subject: String,
  feel: String,
  body: String,
  type: String,
  createdAt: {type: Date, default: Date.now}
});

ContactSchema.statics.add = function(params, cb) {
  new Contact(params).save(function(err) {
    if (err) return cb(console.log(err));
    utils.sendEmail(params, cb);
  })
};

var Contact = module.exports = mongoose.model('Contact', ContactSchema);