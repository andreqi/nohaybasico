// juanchi++
var nodejsx = require('node-jsx').install();
var express = require('express'); 
var Components = require('./app/constants/components');
var view_engine = require('./app/app');
var app = express(); 
var mapsAPI = require('./mapsAPI.js');
var fs = require('fs');
var YAML = require('yamljs');

var mongoose = require('mongoose');
var modelLog = require('./models/log')
var log = require('./log/logger');

var env = process.env.NODE_ENV || 'dev';
var port = (env == 'pro') ? 4321: 1111; 
var bd = (env == 'pro') ? 'nhb': 'testnhb';

mongoose.connect('mongodb://localhost/'+bd, function(err) {
    if (err) {
      console.log('errr', err);
      throw err;
    }
});

app.listen(port);

var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  var date = new Date();
  var day = days[date.getDay()];
  get_restaurants(function(data) {
    var info = loadBd();
    var mLog = new modelLog({
      data: 'pulpin detected',
      time: log.getTime()
    });
    mLog.save(function(err,model) {
      if(err) console.log(err);
      var props = JSON.stringify({
          component: Components.RESTLIST,
      });
      res.render('landing/main', {
        data: data,
        cur_day: day,
        menu_active: info.is_menu_active,
        props: props,
        component: view_engine.start(
          JSON.parse(props)
        ),
      });

    });
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
  var bd = loadBd();
  for (var i = bd.menus.length - 1; i >= 0; i--) {
    if (bd.menus[i].name == id) {
      restaurant.display = bd.menus[i].is_updated;
    }
  };
  // render restaurant
  res.render('restaurant/menu', {
    restaurant: restaurant,
    active_tab: 'menu',
  });
});

app.get('/:id/info', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  var coords = restaurant.coordinates;
  res.render('restaurant/info', {
    restaurant: restaurant,
    active_tab: 'info',
  });
});

app.get('/:id/galeria', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  var coords = restaurant.coordinates;
  var props = JSON.stringify({
    component: Components.GALERIA,
  });

  res.render('restaurant/galeria', {
    restaurant: restaurant,
    active_tab: 'galeria',
    props: props,
    component: view_engine.start(
      JSON.parse(props)
    ),
  });
});



app.get('/:id/carta', function(req, res) {
  var id = req.params.id;
  var restaurant = get_restaurant(id);
  res.render('restaurant/dishes', {
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

function get_restaurants(callback) {
  fs.readdir('./restaurants', function(err, files) {
    var rests = files.filter(function(name) {return name[0] != '.'});
    var mainObj = {};
    mainObj.total = rests.length;
    mainObj.perc = 0;
    var db = loadBd();
    var menus = db.menus;
    var status = {};
    for (var i = menus.length - 1; i >= 0; i--) {
      if (!db.is_menu_active) {
        status[menus[i].name] = false;
      } else {
        status[menus[i].name] = menus[i].is_updated;
      }
    };

    var payback = rests.map(get_restaurant).filter(function(rest) {
      rest.display = true;
      if (rest.homeID in status) {
        rest.display = status[rest.homeID];
      }
      if (rest.display) {
        mainObj.perc++;
      }
      return rest.display == undefined || rest.display == true;
    });
    
    mainObj.restaurants = shuffle(payback);
    callback(mainObj);
  });
}

function get_restaurant(id) {
  var path = './restaurants/' + id + '/info.yml';
  var info;
  try {
    info = YAML.load(path);
  } catch (ex) {
    info = YAML.load('./restaurants/.ejemplo/info.yml');
    info.name = id + 'gg';
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
  return info;
}

function group_by(values, get_key) {
  if (!values) return null;
  var grouped = {};
  values = values || [];
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
    dish_list = dish_list || [];
    var dish_intro = rest.dishes.intro || [];
    dish_list = dish_list.concat(dish_intro);
  } else {
    dish_list = rest.carta;
  }
  dish_list = dish_list || [];
  return dish_list.slice(0, 5);
}

function shuffle(o, size){ 
  for(var j, x, i = o.length; i; 
    j = Math.floor(Math.random() * i), 
    x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function loadBd() {
  var myBDPath = './myMongoBd.yml';
  return YAML.load(myBDPath);
}

console.log("No hay basico");
console.log("Environment " + env);
console.log('Listenning '+ port);

