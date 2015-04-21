var Restaurant = require('../models/Restaurant');
var mongoose = require('mongoose');
var fs = require('fs');
var YAML = require('yamljs');

var basePath = '../restaurants';

function init(tagName) {
  mongoose.connect('mongodb://localhost/nhb', function(err) {
    if (err) return console.log('bd connection error', err);
    var path = basePath + '/' + tagName + '/info.yml';
    console.log('path', path);
    var info;
    try {
      info = YAML.load(path);
      console.log('here');
    } catch (ex) {
      throw tagName + ' ' + ex; 
    }
    console.log(info);
    info.tagName = tagName;
    Restaurant(info).save(function() {
      console.log('new addde');
    })
  });
}
module.exports = init('Eli');