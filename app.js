// juanchi++
var nodejsx = require('node-jsx').install();
var express = require('express'); 
var fs = require('fs');
var YAML = require('yamljs');
var mongoose = require('mongoose');
var middleware = require('./middleware');
var _ = require('lodash');
var session = require('express-session');

var Components = require('./app/constants/components');
var view_engine = require('./app/app');
var mapsAPI = require('./mapsAPI.js');
var modelLog = require('./models/log')
var log = require('./log/logger');
var LandingRoute = require('./routes/LandingRoute')
var PhotoRoute = require('./routes/PhotoRoute')
var config = require('./env')
var Restaurant = require('./models/Restaurant');
var Photo = require('./models/Photo');

var app = express(); 

mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('bd error', err);
    throw err;
  }
});

var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));
middleware(app);

app.get('/testUpload', function(req, res) {
  res.sendFile(__dirname + '/public/indexTest.html')
});

function isServiceAuth(req, res, next) {
  if (config.env === 'dev') {
    /*req.user = {
      _id: '55074c969818b6281627dd48',
      userName: 'dude'
    };*/
  }
  if (req.isAuthenticated()) {
    console.log('no error');
    return next();
  }
  console.log('error');
  return res.send(401, 'No authorized');
}

app.post('/error', function(req, res) {
  console.log(req.body);
  res.send({});
})

app.post('/restaurant/:restId/photo',
         isServiceAuth, PhotoRoute.add);
app.post('/restaurant/:restId/photo/voteDown',
         isServiceAuth, PhotoRoute.voteDown);
app.post('/restaurant/:restId/photo/voteUp',
         isServiceAuth, PhotoRoute.voteUp);
app.post('/restaurant/:restId/photo/delete',
         isServiceAuth, PhotoRoute.delete);

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
  
  Restaurant.findByTagName(req.params.id,
    function(err, restaurant) {

      var rest = restaurant.toObject();
      var coords = rest.location.coordinates
      rest.mapsURL = coords ? 
        mapsAPI.getMapsRedirectURL(coords) : '';  

      res.render('restaurant/info', {
        restaurant: rest,
        active_tab: 'info',
      });
  });
  
});

app.get('/:id/fbPreview', LandingRoute.fbPreview);

app.get('/:id/galery', function(req, res) {
  console.log('galery');
  req.session.redirectUrl = req.url;
  console.log('redirect', req.session.redirectUrl)
  /*
  req.user = {
    _id: '55074c969818b6281627dd48',
    userName: 'dude'
  };*/

  Restaurant.getPhotos(req.params.id, function(err, rest) {

    if (req.user) {
      rest.photos = rest.photos.map(function(elem) {
        var temp = elem.toObject();
        temp.canDelete = (''+elem.createdBy) === req.user._id;
        return temp;
      });
    }
    
    var props = JSON.stringify({
      component: Components.GALERIA,
      tagName: req.params.id,
      id: rest.restaurant.id,
      photos: rest.photos
    });

    var restaurant = rest.restaurant;

    res.render('restaurant/galeria', {
      active_tab: 'galery',
      props: props,
      restaurant: restaurant,
      component: view_engine.start(
        JSON.parse(props)
      ),
    });

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

app.get('/restaurant/map/:lat/:lng', function(req, res) {
  console.log('map');
  var coords = req.params;
  mapsAPI
    .createReadStream(
      coords, 
      { width:600,
        height:400 }, 
      16)
    .pipe(res);
});

app.get('/:id/view', function(req, res) {
  var id = req.params.id;
  Restaurant.getFirstView(id, function(err, model) {
    res.redirect('/' + id + '/'+ model);
  });
});

app.get('/', function(req, res) {
  req.session.redirectUrl = req.url;
  var date = new Date();
  var day = days[date.getDay()];
  
  Restaurant.getPreviewInfo(function(err, data) {
    if (err) res.send({err: console.log(err)});

    if(err) console.log(err);
    var props = JSON.stringify({
        component: Components.RESTLIST,
        restaurants: data
    });
    res.render('landing/main', {
      data: data,
      cur_day: day,
      menu_active: true,
      props: props,
      component: view_engine.start(
        JSON.parse(props)
      ),
    });
  });
});

app.listen(config.port);

console.log("No hay basico");
console.log("database", config.db);
console.log("Environment " + config.env);
console.log('Listenning '+ config.port);

