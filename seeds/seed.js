var Q = require('q');
var mongoose = require('mongoose');

var config = require('../env');
var Restaurant = require('../models/Restaurant');
var User = require('../models/User');

var restaurants = [
  new Restaurant({
    tagName: 'nein-foto', 
    name: 'nein-foto', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    shouldUpdate: {
      photos: true
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
    updated: false, 
    active: true
  }).save(),
  new Restaurant({
    tagName: 'arbolito', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    shouldUpdate: {
      facebook: true
    },
     facebookPost: {
      pattern: 'MENÚ DEL DÍA',
      idPage: '164255087049670',
      idPost: ''
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
    name: 'arbolito', 
    updated: false, 
    active: true
  }).save(),
  new Restaurant({
    tagName: 'sana', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    shouldUpdate: {
      facebook: true
    },
    facebookPost: {
      pattern: 'menú',
      idPage: '592480350770418',
      idPost: ''
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
    name: 'sana', 
    updated: false, 
    active: true
  }).save(),
  new Restaurant({
    name: 'aroma-sabor', 
    tagName: 'aroma-sabor', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    shouldUpdate: {
      facebook: true
    },
    facebookPost: {
      pattern: ' ',
      idPage: '623960747635460',
      idPost: ''
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
    updated: false, 
    active: true
  }).save(),
  new Restaurant({
    name: 'da-gusto', 
    tagName: 'da-gusto', 
    location: {
      coordinates: {
        lat: -12.068178,
        lng: -77.076751
      },
      address: 'Av. Mariano Cornejo 2286, Pueblo Libre'
    },
    shouldUpdate: {
      facebook: true
    },
    facebookPost: {
      pattern: 'ENTRADAS',
      idPage: '339419042845152',
      idPost: ''
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
    updated: false, 
    active: true
  }).save(),
  new Restaurant({
    tagName: 'test', 
    name: 'test', 
    updated: true, 
    active: true,
    menuTypes: '[{"name":"menu","id":"me","price":9}]',
    dishes: '{"intro":[{"name":"Sopa a la minuta","in_menu":["me"]},{"name":"Ocopa","in_menu":["me"]},{"name":"Ensalada rusa","in_menu":["me"]},{"name":"Ensalada fresca","in_menu":["me"]}],"main":[{"name":"Tallarines verdes con bisteck","in_menu":["me"]},{"name":"Mechado de pollo","in_menu":["me"]},{"name":"Churrasco al jugo con menestras","in_menu":["me"]},{"name":"Pollo al sillao","in_menu":["me"]},{"name":"Arroz tapado","in_menu":["me"]},{"name":"Cau cau","in_menu":["me"]},{"name":"Pollo frito con menestras","in_menu":["me"]},{"name":"Bisteck + p. fritas + ensalada","in_menu":["me"]}],"extras":[{"name":"Triple Refresco","in_menu":["me"]}]}',
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
  }).save(),
  new Restaurant({
    tagName: 'tegobi', 
    name: 'tegobi', 
    updated: true, 
    menuTypes: '[{"name":"menu","id":"me","price":9}]',
    dishes: '{"intro":[{"name":"Sopa a la minuta","in_menu":["me"]},{"name":"Ocopa","in_menu":["me"]},{"name":"Ensalada rusa","in_menu":["me"]},{"name":"Ensalada fresca","in_menu":["me"]}],"main":[{"name":"Tallarines verdes con bisteck","in_menu":["me"]},{"name":"Mechado de pollo","in_menu":["me"]},{"name":"Churrasco al jugo con menestras","in_menu":["me"]},{"name":"Pollo al sillao","in_menu":["me"]},{"name":"Arroz tapado","in_menu":["me"]},{"name":"Cau cau","in_menu":["me"]},{"name":"Pollo frito con menestras","in_menu":["me"]},{"name":"Bisteck + p. fritas + ensalada","in_menu":["me"]}],"extras":[{"name":"Triple Refresco","in_menu":["me"]}]}',
    extras: '[{"name":"Hamburguesa de carne","price":3.5,"tag":"Carne"},{"name":"Hamburguesa con queso o huevo","price":4,"tag":"Carne"},{"name":"Hamburguesa royal","price":4.5,"tag":"Carne"},{"name":"Pollo deshilachado","price":4,"tag":"Pollo"},{"name":"Pollo con queso o huevo","price":4.5,"tag":"Pollo"},{"name":"Pollo royal","price":5,"tag":"Pollo"},{"name":"Milanesa","price":4,"tag":"Milanesa"},{"name":"Milanesa con queso o huevo","price":4.5,"tag":"Milanesa"},{"name":"Milanesa royal","price":5,"tag":"Milanesa"},{"name":"Chorizo","price":4,"tag":"Chorizo"},{"name":"Chorizo con queso o huevo","price":4.5,"tag":"Chorizo"},{"name":"Chorizo royal","price":5,"tag":"Chorizo"},{"name":"Hotdog","price":3,"tag":"Hotdog"}]',
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
    active: true
  }).save(),
  new Restaurant({
    tagName: 'lel-lol', 
    name: 'lel', 
    updated: true, 
    active: true,
    extras: '[{"name":"Hamburguesa de carne","price":3.5,"tag":"Carne"},{"name":"Hamburguesa con queso o huevo","price":4,"tag":"Carne"},{"name":"Hamburguesa royal","price":4.5,"tag":"Carne"},{"name":"Pollo deshilachado","price":4,"tag":"Pollo"},{"name":"Pollo con queso o huevo","price":4.5,"tag":"Pollo"},{"name":"Pollo royal","price":5,"tag":"Pollo"},{"name":"Milanesa","price":4,"tag":"Milanesa"},{"name":"Milanesa con queso o huevo","price":4.5,"tag":"Milanesa"},{"name":"Milanesa royal","price":5,"tag":"Milanesa"},{"name":"Chorizo","price":4,"tag":"Chorizo"},{"name":"Chorizo con queso o huevo","price":4.5,"tag":"Chorizo"},{"name":"Chorizo royal","price":5,"tag":"Chorizo"},{"name":"Hotdog","price":3,"tag":"Hotdog"}]',
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
  }).save(),
  new Restaurant({
    alwaysUpdate: true,
    tagName: 'ggwp',
    name: 'dude',
    updated: true,
    active: true
  }).save()
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