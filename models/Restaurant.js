var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestaurantSchema = new Schema({
  location: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  contact: {
    social: {
      facebook: {type: String, default: ''},
      twitter: {type: String, default: ''}
    },
    workTime: String,
    msg: String
  },
  name: String,
  walkingTime: String,
  priceRange: String,
  active: {type: Boolean, default: false},
  updated: {type: Boolean, default: false},
  updateSource: {
    facebook: {type: Boolean, default: false},
    pulpinPhoto: {type: Boolean, default: false}
  },
  facebookPost: {
    idPage: {type: String},
    idPost: {type: String}
  }
});

RestaurantSchema.statics.updatedPhoto = function(id, count, cb) {
  Restaurant.findById(id, function(err, model) {
    if (err) return cb(console.log(err));
    model.updateSource.pulpinPhoto = count > 0;
    model.updated = model.updateSource.facebook || 
                  model.updateSource.pulpinPhoto;
    model.save(cb);
  });
};

RestaurantSchema.statics.getPreviewInfo = function(cb) {
  var query = {
    active: true
  };

  var fields = {
    contact: 0,
    location: 0,
    active: 0,
    __v: 0
  };

  Restaurant.find(query, fields).exec(cb);
}

var Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);