var Q = require('q');
var mongoose = require('mongoose');

var config = require('../env');
var Restaurant = require('../models/Restaurant');
var User = require('../models/User');

var restaurants = [
  new Restaurant({name: 'test', active: true}).save(),
  new Restaurant({name: 'test', active: true}).save(),
  new Restaurant({name: 'test', active: true}).save()
];

var users = [
  new User({name: 'gg'}).save()
];

function init() {
  var tasks = users.concat(restaurants);
  mongoose.connect(config.db, function(err) {
    if (err) return console.log('bd connection error', err);
    Q.all(tasks)
      .then(function(results) {
        console.log('done')
        process.exit();
      }, function(err) {
        console.log('error', err)
        process.exit();
      })
});
}

module.exports = init();