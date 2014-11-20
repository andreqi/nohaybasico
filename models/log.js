var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var logSchema = new Schema({
  data:  String,
  time: String
});

var Log = module.exports = mongoose.model('Log', logSchema);