var CronJob = require('cron').CronJob;

var Photo = require('../models/Photo');
var Restaurant = require('../models/Restaurant');

var time = '00 30 22 * * 1-6';
//var time = '0 */1 * * * *';

var job = new CronJob({
  cronTime: time,
  onTick: function() {
    cleanbd();
  }
});

var cleanbd = function() {
  Restaurant.close(function(err, done) {
    if (err) console.log('err', err);
    else console.log('Restaurant cleaned', done);
  });
  Photo.clean(function(err, data) {
    if (err) return cb(console.log(err));
    console.log('Photos cleaned', data);
  })
}

function start() {
  console.log('dailyClean')
  job.start();
}

exports.start = start;

