var dbURI    = 'mongodb://localhost/nohaybasicotest';
var expect   = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../models/User');
var clearDB  = require('mocha-mongoose')(dbURI);

describe("User Mongo Test", function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  it("create new user", function(done) {
    var params = {
      name: 'namerino',
      provider_id: '12341234',
      provider: 'facebook'
    };

    User.findOrCreate(params, function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      expect(model.name).to.equal(params.name);
      expect(model.provider_id).to.equal(params.provider_id);
      expect(model.provider).to.equal(params.provider);

      done();
    });
  });

  it("update user created", function(done) {
    var params = {
      name: 'namerino',
      provider_id: '12341234',
      provider: 'facebook'
    };

    var newUser = new User(params);

    newUser.save(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      User.findOrCreate(params, function(err, user) {
        expect(err).to.not.exist;
        expect(model).to.exist;
        expect(model.lastAccess).to.not.equal(user.lastAccess);

        done();
      });
    });

  });

});