var Q = require('q');
var mongoose = require('mongoose');
var fs = require('fs');
var YAML = require('yamljs');

var config = require('../env');
var Restaurant = require('../models/Restaurant');
var User = require('../models/User');

var basePath = '../restaurants';

var users = [
  new User({name: 'gg'}).save()
];

var stringify = function(obj, field) {
  if (obj[field]) {
    obj[field] = JSON.stringify(obj[field]);
  }
}

var getRestaurant = function(tagName) {
  var path = basePath + '/' + tagName + '/info.yml';
  var info;
  try {
    info = YAML.load(path);
  } catch (ex) {
    throw tagname + ' ' + ex; 
  }
  stringify(info, 'extras');
  stringify(info, 'dishes');
  stringify(info, 'menuTypes');

  info.tagName = tagName;
  return new Restaurant(info).save();
}
var readRestaurants = function(cb) {
  fs.readdir(basePath, function(err, files) {
    if (err) return cb(err);
    var rests = files.filter(function(name) {return name[0] != '.'});
    return cb(null, rests.map(getRestaurant));
  });
}

function init() {
  var tasks = [];
  mongoose.connect(config.db, function(err) {
    if (err) return console.log('bd connection error', err);
    readRestaurants(function(err, restaurants) {
      if (err) return console.log('error');
      tasks = users.concat(restaurants);
      Q.all(tasks)
        .then(function(results) {
          console.log('done')
          process.exit();
        }, function(err) {
          console.log('error', err)
          process.exit();
        })
    });
  }); 
}

module.exports = init();