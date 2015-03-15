var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var moment = require('moment');
var fs = require('fs');

var Restaurant = require('./Restaurant');

var PhotoSchema = new Schema({
  path: String,
  totalVotes: {type: Number, default: 0},
  showTime: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, ref: 'User'},
  restaurant: {type: ObjectId, ref: 'Restaurant'},
  votes: [{
    vote: Number,
    user: {type: ObjectId, ref: 'User'}
  }]
});

PhotoSchema.statics.vote = function(params, cb) {
  
  Photo.findOne({_id: params.id}, function(err, model) {
    if (err) return cb(err);

    var i = 0;
    for (var len = model.votes.length; i < len; i++) {
      
      if (model.votes[i].user.equals(params.userId)) {
        break;
      }
    };
    model.totalVotes += params.vote;
    if (i < len) {
      model.totalVotes = -1*model.votes[i].vote;
      model.votes[i].vote = params.vote;
    }
    else {
      var newVote = {
        vote: params.vote,
        user: params.userId
      }
      model.votes.push(newVote);
    }
    model.save(cb);
  });
};

PhotoSchema.statics.voteUp = function(params, cb) {
  params['vote'] = 1;
  Photo.vote(params, cb);
};

PhotoSchema.statics.voteDown = function(params, cb) {
  params['vote'] = -1;
  Photo.vote(params, cb);
};

function getQueryPhotos() {
  var now = moment();
  var today = moment().startOf('day');
  var yesterday = moment(today).subtract(1, 'days');
  
  var query = {
    showTime: {
      $lt: now.toDate(),
      $gte: yesterday.toDate()
    }
  };
  return query;
}

function validateUpdated(idRest, cb) {
  var query = getQueryPhotos();
  query['restaurant'] =  idRest;
  Photo.count(query, function(err, count) {
    if (err) return cb(console.log(err));
    Restaurant.updatedPhoto(idRest, count, cb);
  });
}

//params path, createdBy, restaurant [, showTime]
PhotoSchema.statics.addPhoto = function(params, cb) {
  new Photo(params).save(function(err, model) {
    if (err) return cb(console.log(err));
    validateUpdated(params.restaurant, function(err) {
      if (err) return cb(console.log(err));
      return cb(null, model);
    })
  });
};

PhotoSchema.statics.removePhoto = function(path, cb) {
  Photo.findOneAndRemove({path: path}, function(err) {
    if (err) return cb(console.log(err));
    fs.unlink(path, cb);
  })
};

PhotoSchema.statics.getPhotos = function(idRest, cb) {
  var query = getQueryPhotos();
  query['restaurant'] =  idRest;
  var fields = {
    path: 1,
    totalVotes: 1,
    showTime: 1,
    createdBy: 1
  }
  Photo.find(query, fields).sort('-totalVotes').exec(cb);
}

var Photo = module.exports = mongoose.model('Photo', PhotoSchema);