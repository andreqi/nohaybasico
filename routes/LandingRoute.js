var nodejsx = require('node-jsx').install();

var Contact = require('../models/Contact');
var Restaurant = require('../models/Restaurant');
var Components = require('../app/constants/components');
var view_engine = require('../app/app');

exports.fbPreview = function(req, res) {
  Restaurant.findByTagName(req.params.id, 
    function(err, model){

      var restaurant = model.toObject();
      if (restaurant.dishes) restaurant.dishes = true;
      if (restaurant.extras) restaurant.extras = true;

      var props = JSON.stringify({
        component: Components.FBPREVIEW,
        restaurant: restaurant
      });

      res.render('restaurant/fbPreview', {
        active_tab: 'fbPreview',
        props: props,
        restaurant: restaurant,
        component: view_engine.start(
          JSON.parse(props)
        )
      });
  });
};

exports.contact = function(req, res) {
  var props = JSON.stringify({
    component: Components.CONTACT
  });

  res.render('landing/contact', {
    user: req.user,
    props: props,
    component: view_engine.start(
      JSON.parse(props)
    )
  })
};

exports.saveContact = function(req, res) {
  req.body.user = JSON.stringify(req.user);
  Contact.add(req.body, function(err, model) {
    if (err) return res.send({err: err});
    res.send({msg: 'OK'});
  })
};

exports.addRestaurant = function(req, res) {
  var props = JSON.stringify({
    component: Components.CONTACT,
    typeRequest: 'Nuevo restaurante'
  });

  res.render('landing/contact', {
    user: req.user,
    props: props,
    component: view_engine.start(
      JSON.parse(props)
    )
  })
}

exports.logout = function(req, res){
  var redirectUrl = req.session.redirectUrl || '/';
  console.log('logout', redirectUrl);
  req.logout();
  res.redirect(redirectUrl);
};