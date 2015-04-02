var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var moment = require('moment');
var fs = require('fs');

var Restaurant = require('./Restaurant');

var PhotoSchema = new Schema({
  path: String,
  totalVotes: {type: Number, default: 0},
  positiveVotes: {type: Number, default: 0},
  negativeVotes: {type: Number, default: 0},
  showTime: {type: Date, default: Date.now},
  createdAt: {type: Date, default: Date.now},
  createdBy: {type: ObjectId, ref: 'User'},
  restaurant: {type: ObjectId, ref: 'Restaurant'},
  restTagName: String,
  userName: String,
  votes: [{
    vote: Number,
    user: {type: ObjectId, ref: 'User'}
  }]
});

// path: path photo, userId, vote: 1 / 0, 
PhotoSchema.statics.vote = function(params, cb) {
  Photo.findOne({path: params.path}, function(err, model) {
    if (err) return cb(err);

    var i = 0;
    for (var len = model.votes.length; i < len; i++) {
      if (model.votes[i].user.equals(params.userId)) {
        break;
      }
    };
    model.totalVotes += params.vote;
    if (params.vote > 0) {
      model.positiveVotes++;
    } else {
      model.negativeVotes++;
    }

    if (i < len) {
      if (model.votes[i].vote > 0) {
        model.positiveVotes--;
      } else {
        model.negativeVotes--;
      }
      model.totalVotes += -1 * model.votes[i].vote;
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
    console.log('removePhoto 3')
    if (err) return cb(console.log(err));
    Restaurant.updatedPhoto(idRest, count, cb);
  });
}

//params path, createdBy, restaurant [, showTime]
PhotoSchema.statics.addPhoto = function(params, cb) {
  params.path = '/' + params.path;
  new Photo(params).save(function(err, model) {
    if (err) return cb(console.log(err));
    validateUpdated(params.restaurant, function(err) {
      if (err) return cb(console.log(err));
      return cb(null, model);
    })
  });
};

PhotoSchema.statics.clean = function(cb) {
  var uploadBy = function(totalVotes) {
    return {
      points: 100,
      type: 'upload',
      likes: totalVotes
    }
  };
  var voteBy = function() {
    return {
      points: 30,
      type: 'vote'
    }
  };
  var users = {};
  var query = {};
  var fields = {
    path: 1,
    totalVotes: 1,
    createdBy: 1,
    votes: 1
  };
  Photo.find(query, fields).exec(function(err, photos) {
    if (err) return cb(console.log(err));
    photos.forEach(function(photo) {
      var user = photo.createdBy;
      if (!(user in users)) {
        users[user] = [];
      }
      users[user].push(uploadBy(photo.totalVotes));

      photo.votes.forEach(function(vote) {
        user = vote.user;
        if (!(user in users)) {
          users[user] = [];
        }
        users[user].push(voteBy());
      });
    });
    Photo.removePhotos(function(err, res) {
      if (err) return cb(console.log(err));
      console.log('removePhotos');
      cb(null, res)
    });
  });
  //do things users users
}

function removeFiles(path) {
  fs.readdirSync(path)
    .forEach(function(fileName) {
      console.log(fileName);
      fs.unlinkSync(path+'/'+fileName);
    });
}

PhotoSchema.statics.removePhotos = function(cb) {
  Photo.remove({}, function(err, res){
    if (err) return cb(console.log(err));
    removeFiles('../public/uploads');
    cb(null);
  });
};

PhotoSchema.statics.removePhoto = function(params, cb) {
  console.log('params', params);
  Photo.findOneAndRemove({path: params.path}, function(err) {
    console.log('removePhoto 1')
    if (err) return cb(console.log(err));
    var path = params.path.substr(1);
    console.log('new path', path)
    fs.unlink(path, function(err) {
      console.log('removePhoto 2')
      if (err) return cb(console.log(err));
      validateUpdated(params.restaurant, cb)
    });
  })
};

PhotoSchema.statics.getPhotos = function(idRest, cb) {
  var query = getQueryPhotos();
  query['restaurant'] =  idRest;
  var fields = {
    path: 1,
    totalVotes: 1,
    showTime: 1,
    createdBy: 1,
    userName: 1,
    positiveVotes: 1,
    negativeVotes: 1,
    votes: 1
  }
  Photo.find(query, fields).sort('-totalVotes').exec(cb);
}

var Photo = module.exports = mongoose.model('Photo', PhotoSchema);