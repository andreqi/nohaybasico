var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestaurantSchema = new Schema({
  address: String,
  name: String,
  walkingTime: String,
  price_range: String
});

var Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);