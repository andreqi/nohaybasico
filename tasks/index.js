var mongoose = require('mongoose');

var dailyClean = require('./dailyClean');
var menuUpdater = require('./MenuUpdater');
var config = require('../env');


(function() {
  
  mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('err mongo connection', err);
    throw err;
  }
    dailyClean.start();
    menuUpdater.start();
  });

})();
