var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var Photo = require('./Photo');

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
  tagName: {type: String, required: true},
  name: {type: String, required: true},
  walkingTime: String,
  priceRange: String,
  active: {type: Boolean, default: false},
  updated: {type: Boolean, default: false},
  updateSource: {
    facebook: {type: Boolean, default: false},
    pulpinPhoto: {type: Boolean, default: false}
  },
  shouldUpdate: {
    facebook: {type: Boolean, default: false}
  },
  facebookPost: {
    pattern: {type: String},
    idPage: {type: String},
    idPost: {type: String},
    lastPost: {type: String}
  },
  createdAt: {type: Date, default: Date.now}
});

RestaurantSchema.statics.findByTagName = function(tagName, cb) {
  Restaurant.findOne({tagName: tagName}, cb);
}

RestaurantSchema.statics.getId = function(tagName, cb) {
  Restaurant.findOne({tagName: tagName}, {_id: 1}, cb);
}

RestaurantSchema.statics.updatedPhoto = function(id, count, cb) {
  console.log('id', id);
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

RestaurantSchema.statics.getPhotos = function(tagName, cb) {
  Restaurant.findOne({tagName: tagName}, function(err, model) {
    if (err) return cb(console.log(err));
    var response = {
      name: model.name
    };
    console.log('here ps', model._id)
    mongoose.model('Photo').getPhotos(model._id, function(err, photos) {
      if (err) return cb(console.log(err));
      response['photos'] = photos;
      cb(null, response);
    });
  })
};

RestaurantSchema.statics.getListMenuUpdater = function(cb) {
  var query = {
    active: true,
    'shouldUpdate.facebook': true
  };
  var fields = {
    facebookPost: 1,
    _id: 0,
    tagName: 1
  }

  Restaurant.find(query, fields).exec(cb);
}

RestaurantSchema.statics.updateFacebookMenu = function(id, data, cb) {
  Restaurant.findById(id, function(err, model){
    if (err) return cb(err);
    model.facebookPost = data;
    model.updateSource.facebook = true;
    model.updated = model.updateSource.facebook || 
                    model.updateSource.pulpinPhoto;
    model.save(cb);
  });
}

var Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);