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

app.get('/:id', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  if (has_menu(restaurant)) {
    res.redirect('/'+id+'/menu');
  } else {
    res.redirect('/'+id+'/carta');
  }
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
  mapsAPI
    .createReadStream(
      coords.lat, 
      coords.lng, 
      { width:600,
        height:400 }, 
      16)
    .pipe(res);
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function get_restaurants(callback) {
  fs.readdir('./restaurants', function(err, files) {
    var rests = files.filter(function(name) {return name[0] != '.'});
    var payback = rests.map(get_restaurant);
    callback(shuffle(payback));
  });
}

function get_restaurant(id) {
  var path = './restaurants/' + id + '/info.yml';
  var info;
  try {
    info = YAML.load(path);
  } catch (ex) {
    info = YAML.load('./restaurants/ejemplo/info.yml');
    info.name = id;
  }
  var coords = info.coordinates;
  info.bannerURL = '/restaurants/banner/' + id;
  info.homeID = id;
  info.dish_preview = get_dish_preview(info);
  info.mapsURL = coords ? 
    mapsAPI.getMapsRedirectURL(coords.lat, coords.lng) : '';
  info.grouped_by_carta = group_by(info.carta, function(e) {
    return e.tag;
  });
  console.log(info.grouped_by_carta);
  return info;
}

function group_by(values, get_key) {
  var grouped = {};
  for (var idx = 0, len = values.length; idx < len; idx++) {
    var val = values[idx];
    var key = get_key(val);
    if (grouped[key]) {
      grouped[key].push(val);
    } else {
      grouped[key] = [val];
    }
  }
  return grouped;
}

function has_menu(rest) {
  return rest.dishes != undefined;
}

function get_dish_preview(rest) {
  var dish_list = [];
  if (has_menu(rest)) {
    dish_list = rest.dishes.main;
  } else {
    dish_list = rest.carta;
  }
  return dish_list.slice(1, 6);
}
function shuffle(o, size){ 
  for(var j, x, i = o.length; i; 
    j = Math.floor(Math.random() * i), 
    x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

console.log('Listenning '+port);
