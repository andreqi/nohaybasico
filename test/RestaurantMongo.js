var dbURI    = 'mongodb://localhost/nohaybasicotest';
var expect   = require('chai').expect;
var moment = require('moment');
var mongoose = require('mongoose');
var Q = require('q')
var clearDB  = require('mocha-mongoose')(dbURI);

var Restaurant = require('../models/Restaurant');

describe("Restaurant test", function() {
  var tasks = [
    new Restaurant({name: 'r1', active: true}).save(),
    new Restaurant({name: 'r2', active: true}).save(),
    new Restaurant({name: 'r3'}).save()
  ];

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, function(err) {
      Q.all(tasks)
        .then(function(results) {
          done();
        }, function (err) {
          console.log(err);
        });
    });
  });

  it("get preview info", function(done) {
    Restaurant.getPreviewInfo(function(err, model) {
      expect(err).to.not.exist;
      expect(model).to.exist;
      expect(model.length).to.equal(tasks.length -1);
      done();
    });
  });

});