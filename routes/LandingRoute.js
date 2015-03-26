var nodejsx = require('node-jsx').install();

var Restaurant = require('../models/Restaurant');
var Components = require('../app/constants/components');
var view_engine = require('../app/app');

exports.fbPreview = function(req, res) {
  Restaurant.findByTagName(req.params.id, 
    function(err, model){

      var props = JSON.stringify({
        component: Components.FBPREVIEW,
        restaurant: model
      });

      var restaurant = {
        tagName: req.params.id,
        name: model.name,
        fbPreview: true
      }

      res.render('restaurant/fbPreview', {
        active_tab: 'fbPreview',
        props: props,
        restaurant: restaurant,
        component: view_engine.start(
          JSON.parse(props)
        )
      });
  });
}