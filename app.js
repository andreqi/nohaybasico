var express = require('express'); 
var app = express(); 
var mapsAPI = require('./mapsAPI.js');
var fs = require('fs');
var YAML = require('yamljs');

var port = 4321;
app.listen(port);

app.get('/', function(req, res) {
  get_restaurants(function(data) {
    res.render('main', {restaurants: data});
  });
});

app.get('/:id/menu', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  // render restaurant
  res.render('restaurant-menu', {
    restaurant: restaurant,
    active_tab: 'menu',
  });
});

app.get('/:id/info', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  res.render('restaurant-info', {
    restaurant: restaurant,
    active_tab: 'info',
  });
});

app.get('/:id/carta', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  res.render('restaurant-dishes', {
    restaurant: restaurant,
    active_tab: 'carta',
  });
});

app.get('/restaurant/map/:id', function(req, res) {
  var id = req.params.id; 
  var rest = get_restaurant(id);
  var coords = rest.coordinates;
  mapsAPI.createReadStream(coords.lat, coords.lng, null, 15).pipe(res);
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function get_restaurants(callback) {
  fs.readdir('./restaurants', function(err, files) {
    var rests = files.filter(function(name) {return name[0] != '.'});
    var payback = rests.map(get_restaurant);
    callback(payback);
  });
}

function get_restaurant(id) {
  var path = './restaurants/' + id + '/info.yml';
  var info = YAML.load(path);
  var coords = info.coordinates;
  info.bannerURL = '/restaurants/banner/' + id;
  info.homeID = id;
  info.mapsURL = coords ? mapsAPI.getMapsRedirectURL(coords.lat, coords.lng) : '';
  return info;
}

console.log('Listenning '+port);
