var dbURI    = 'mongodb://localhost/nohaybasicotest';
var expect   = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../models/User');
var Photo = require('../models/Photo');
var clearDB  = require('mocha-mongoose')(dbURI);

describe("Photo test", function() {

  var id = '54ff995ab0bccbb401bd3df9';

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, function(err) {

      var params = {
        _id: id,
        name: 'namerino',
        provider_id: '12341234',
        provider: 'facebook'
      }
      new User(params).save(done);

    });

  });

  it("create new Photo by User", function(done) {
    var params = {
      picture: 'img',
      createBy: id
    };
    new Photo(params).save(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      expect('' + model.createBy).to.equal(params.createBy);
      done();
    })
    
  });

  it("upvote photo, no votes", function(done) {
    var params = {
      picture: 'img',
      createBy: id
    };
    new Photo(params).save(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      var params = {
        userId: id,
        id: model._id
      }

      Photo.voteUp(params, function(err, photoUpt) {
        expect(err).to.not.exist;
        expect(photoUpt).to.exist;
        expect(photoUpt.votes.length).to.equal(1);
        expect(photoUpt.votes[0].vote).to.equal(1);
        done();
      });

    })
  });

  it("updown photo, update existing vote", function(done) {
    var params = {
      picture: 'img',
      createBy: id
    };
    new Photo(params).save(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      var params = {
        userId: id,
        id: model._id
      }

      Photo.voteUp(params, function(err, photoUpt) {
        expect(err).to.not.exist;
        expect(photoUpt).to.exist;
        expect(photoUpt.votes.length).to.equal(1);
        
        Photo.voteDown(params, function(err, newVote) {
          expect(err).to.not.exist;
          expect(newVote).to.exist;
          
          expect(newVote.votes.length).to.equal(1);
          expect(newVote.votes[0].vote).to.equal(-1);

          done();
        })

      });

    })
  });

});