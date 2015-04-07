// juanchi++
var nodejsx = require('node-jsx').install();
var express = require('express'); 
var fs = require('fs');
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
var PhotoRoute = require('./routes/PhotoRoute');
var RestaurantRoute = require('./routes/RestaurantRoute')
var config = require('./env')
var Restaurant = require('./models/Restaurant');
var Photo = require('./models/Photo');
var util = require('./utils');

var app = express(); 

mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('bd error', err);
    throw err;
  }
});

var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function nextActiveDay() {
  var nextIdx = new Date().getDay() + 1;
  nextIdx = nextIdx == days.length ? 1: nextIdx;
  return days[nextIdx];
}

function isOpen() {
  var date = new Date();
  var day = days[date.getDay()];
  var hour = date.getHours();
  var minute = date.getMinutes();
  var work = config.work;
  if (day === 'Domingo') return false;
  if (hour < work.open.hour && minute < work.open.minute)
    return false;
  if (hour > work.close.hour && minute > work.close.minute)
    return false;
  return true;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));
middleware(app);

function saveUrl(req, res, next) {
  req.session.redirectUrl = req.url;
  return next();
}

function isServiceAuth(req, res, next) {
  if (config.env === 'dev') {
    /*req.user = {
      _id: '55074c969818b6281627dd48',
      userName: 'dude'
    };*/
  }
  if (req.isAuthenticated()) {
    console.log('user log');
    return next();
  }
  console.log('ne log');
  return res.send(401, 'No authorized');
}
app.get('/contact/add', saveUrl, LandingRoute.addRestaurant);
app.get('/contact',saveUrl,  LandingRoute.contact);
app.get('/logout', LandingRoute.logout);

app.post('/contact', LandingRoute.saveContact);

app.post('/auth', isServiceAuth, function(req, res) {
  res.send(200, 'OK');
});

app.post('/restaurant/getSample', RestaurantRoute.getSample);
app.post('/restaurant/getAllTags', RestaurantRoute.getAllTags);
app.post('/restaurant/:restId/getAllInfo', RestaurantRoute.getAllInfo);
app.post('/restaurant/:restId/getSimpleMenu', RestaurantRoute.getSimpleMenu);
app.post('/restaurant/:restId/updateSimpleMenu', RestaurantRoute.updateSimpleMenu);

app.post('/restaurant/:restId/photo',
         isServiceAuth, PhotoRoute.add);
app.post('/restaurant/:restId/photo/voteDown',
         isServiceAuth, PhotoRoute.voteDown);
app.post('/restaurant/:restId/photo/voteUp',
         isServiceAuth, PhotoRoute.voteUp);
app.post('/restaurant/:restId/photo/delete',
         isServiceAuth, PhotoRoute.delete);

app.get('/:id/menu', function(req, res) {
  Restaurant.findByTagName(req.params.id, 
    function(err, restaurant) {
      var rest = restaurant.toObject();
      if (rest.dishes) {
        rest.dishes = JSON.parse(rest.dishes);
      }
      if (rest.extras) {
        rest.extras = true;
      }
      if (rest.menuTypes) {
        rest.menuTypes = JSON.parse(rest.menuTypes);
      }
      res.render('restaurant/menu', {
        restaurant: rest,
        active_tab: 'menu',
        user: req.user
      });
    }
  );
});

app.get('/:id/contact', saveUrl, function(req, res) {
  Restaurant.findByTagName(req.params.id,
    function(err, restaurant) {

      var rest = restaurant.toObject();
      if (rest.dishes) rest.dishes = true;
      if (rest.extras) rest.extras = true;

      var props = JSON.stringify({
        component: Components.CONTACT,
        tagName: req.params.id
      });
      res.render('restaurant/contact', {
        restaurant: rest,
        active_tab: 'contact',
        user: req.user,
        props: props,
        component: view_engine.start(
          JSON.parse(props)
        )
      });

    }
  );
});

app.get('/:id/info',saveUrl, function(req, res) {
  Restaurant.findByTagName(req.params.id,
    function(err, restaurant) {

      var rest = restaurant.toObject();
      if (rest.dishes) rest.dishes = true;
      if (rest.extras) rest.extras = true;
      var coords = rest.location.coordinates
      rest.mapsURL = coords ? 
        mapsAPI.getMapsRedirectURL(coords) : '';  

      res.render('restaurant/info', {
        restaurant: rest,
        active_tab: 'info',
        user: req.user,
      });
  });
  
});

var managePhotos = function(rest, userId) {
  rest.photos = rest.photos.map(function(elem) {
    var temp = elem.toObject();
    temp.canDelete = (''+elem.createdBy) === userId;
    return temp;
  });

  for (var i = rest.photos.length - 1; i >= 0; i--) {
    var vote = 0;
    for (var j = rest.photos[i].votes.length - 1; j >= 0; j--) {
      if (''+rest.photos[i].votes[j].user === userId) {
        vote = rest.photos[i].votes[j].vote;
        break;
      }
    };
    if (vote) {
      rest.photos[i].ownVote = vote;
    }
    rest.photos[i].votes = null;        
  };
}

app.get('/:id/fbPreview',saveUrl,  LandingRoute.fbPreview);

app.post('/:id/updatePhotos', function(req, res) {
  Restaurant.getPhotos(req.params.id, function(err, rest) {
    if (req.user) {
      managePhotos(rest, req.user._id);
    }
    res.send({images: rest.photos})
  });
});

app.get('/:id/galery',saveUrl, function(req, res) {
  Restaurant.getPhotos(req.params.id, function(err, rest) {
    if (req.user) {
      managePhotos(rest, req.user._id);
    }
    
    var props = JSON.stringify({
      component: Components.GALERIA,
      tagName: req.params.id,
      id: rest.restaurant.id,
      photos: rest.photos,
      userLog: req.isAuthenticated(),
    });

    var restaurant = rest.restaurant;

    res.render('restaurant/galeria', {
      active_tab: 'galery',
      props: props,
      user: req.user,
      restaurant: restaurant,
      user: req.user,
      component: view_engine.start(
        JSON.parse(props)
      ),
    });

  });
});

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


app.get('/:id/carta',saveUrl,  function(req, res) {
  Restaurant.findByTagName(req.params.id, function(err, model){
    var rest = model.toObject();
    var extras = JSON.parse(rest.extras);
    rest.grouped_by_carta = group_by(extras, function(e) {
      return e.tag;
    });
    rest.extras = true;
    if (rest.dishes) rest.dishes = true;
    res.render('restaurant/dishes', {
      restaurant: rest,
      active_tab: 'carta',
      user: req.user
    });
  });  
});

app.get('/restaurant/map/:lat/:lng', function(req, res) {
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

app.get('/',saveUrl,  function(req, res) {
  var day = days[new Date().getDay()];
  
  Restaurant.getPreviewInfo(function(err, data) {
    if (err) res.send({err: console.log(err)});
    var menu_active = isOpen();
    data = util.suffle(data);
    var props = JSON.stringify({
      component: Components.RESTLIST,
      menuActive: menu_active,
      restaurants: data,
      nextDay: nextActiveDay()
    });
    var summary = {
      perc: 0,
      total: data.length
    }

    for (var i = 0; i < data.length; i++) {
      summary.perc += data[i].updated? 1: 0;
    };
    res.render('landing/main', {
      data: summary,
      cur_day: day,
      menu_active: menu_active,
      props: props,
      user: req.user,
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

