var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  provider_id: String,
  provider: String,
  name: String,
  createdAt: {type: Date, default: Date.now},
  lastAccess: {type: Date, default: Date.now}
});

UserSchema.statics.findOrCreate = function(params, cb) {
  User.findOne(params, function(err, user) {
    if (err) return cb(err);
    if (user) {
      User.findByIdAndUpdate(
        user._id,
        {lastAccess: Date.now()},
        function (err) {
          if (err) return cb(err);
          return cb(null, user);
      });
    }
    else {
      var newUser = new User(params);
      newUser.save(function(err) {
        if (err) return cb(err);
        return cb(null, newUser);
      });
    }

  });
};

var User = module.exports = mongoose.model('User', UserSchema);