var Q = require('q');
var mongoose = require('mongoose');

var config = require('../env');
var Restaurant = require('../models/Restaurant');
var User = require('../models/User');

var restaurants = [
  new Restaurant({
    tagName: 'da-gusto', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    contact: {
      social: {
        facebook: 'https://www.facebook.com/pages/Da-Gusto/339419042845152?fref=ts'
      },
      workTime: 'Lunes a Sábado de 12pm a 5pm',
      msg: 'Contáctanos en (01) 7355375'
    },
    walkingTime: '5 mins',
    priceRange: '4 - 11',
    name: 'da gusto', 
    updated: true, 
    active: true
  }).save(),
  new Restaurant({tagName: 'aroma-sabor', name: 'aroma sabor', updated: true, active: true}).save(),
  new Restaurant({tagName: 'tegobi', name: 'tegobi', updated: true, active: true}).save(),
  new Restaurant({tagName: 'lel-lol', name: 'lel', updated: true, active: true}).save()
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