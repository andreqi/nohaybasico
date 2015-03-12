var dbURI    = 'mongodb://localhost/nohaybasicotest';
var expect   = require('chai').expect;
var moment = require('moment');
var mongoose = require('mongoose');
var clearDB  = require('mocha-mongoose')(dbURI);

var User = require('../models/User');
var Photo = require('../models/Photo');
var Restaurant = require('../models/Restaurant');

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
      path: 'img',
      createdBy: id
    };
    new Photo(params).save(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;

      expect('' + model.createdBy).to.equal(params.createdBy);
      done();
    })
    
  });

  it("upvote photo, no votes", function(done) {
    var params = {
      path: 'img',
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
      path: 'img',
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

  it("get photos from restaurant if not show time", function(done) {
    new Restaurant({}).save(function(err, rest) {
      expect(err).to.not.exist;

      var params = {
        createdBy: id,
        restaurant: rest._id,
        showTime: moment().subtract(1, 'm').toDate()
      }

      new Photo(params).save(function(err, newPhoto) {
        expect(err).to.not.exist;

        Photo.getPhotos(rest._id, function(err, model) {
          expect(err).to.not.exist;
          expect(model.length).to.equal(0);
          done();
        });

      });

    })
  });

  it("get photos from restaurant if show time", function(done) {
    new Restaurant({}).save(function(err, rest) {
      expect(err).to.not.exist;

      var params = {
        createdBy: id,
        restaurant: rest._id,
        showTime: moment().add(1, 'm').toDate()
      }

      new Photo(params).save(function(err, newPhoto) {
        expect(err).to.not.exist;

        Photo.getPhotos(rest._id, function(err, model) {
          expect(err).to.not.exist;
          expect(model.length).to.equal(1);
          done();
        });

      });
    })
  });

  it("get photos from restaurant if show time", function(done) {
    new Restaurant({}).save(function(err, rest) {
      expect(err).to.not.exist;

      var params = {
        createdBy: id,
        restaurant: rest._id,
        showTime: moment().add(1, 'm').toDate(),
        totalVotes: 5
      }

      new Photo(params).save(function(err, newPhoto) {
        expect(err).to.not.exist;

        var params2 = {
          createdBy: id,
          restaurant: rest._id,
          showTime: moment().add(1, 'm').toDate(),
          totalVotes: 2
        }

        new Photo(params2).save(function(err, newPhoto) {
          expect(err).to.not.exist;

          Photo.getPhotos(rest._id, function(err, model) {
            expect(err).to.not.exist;
            expect(model.length).to.equal(2);
            expect(model[0].totalVotes).to.be.above(model[1].totalVotes);
            done();
          });
        });


      });
    })
  });

});