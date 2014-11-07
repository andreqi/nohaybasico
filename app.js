var express = require('express'); 
var app = express(); 
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
  res.render('restaurant-info', {
    restaurant: restaurant,
    active_tab: 'menu',
  });
});

app.get('/:id/contacto', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  res.render('restaurant-contact', {
    restaurant: restaurant,
    active_tab: 'contacto',
  });
});

app.get('/restaurants/banner/:id', function(req, res) {
  var id = req.params.id; 
  var restaurant_path = './restaurants/'+ id +'/banner.jpg';
  fs.readFile(restaurant_path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/gif'});
    res.end(data, 'binary');
  });
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
  info.bannerURL = '/restaurants/banner/' + id;
  info.homeID = id;
  return info;
}

console.log('Listenning '+port);
