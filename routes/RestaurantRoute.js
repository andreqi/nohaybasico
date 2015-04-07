var Restaurant = require('../models/Restaurant');

exports.getAllTags = function(req, res) {
  Restaurant.getTagNames(function(err, models) {
    if (err) res.send({err: console.log(err)});
    res.send(models);
  })
};

exports.getAllInfo = function(req, res) {
  console.log()
  Restaurant.getAllInfo(req.params.restId, function(err, model) {
    if (err) res.send({err: console.log(err)});
    res.send(model);
  });
};

exports.getSample = function(req, res) {
  var example ={updated: true, menuTypes:[{name:"económico",id:"ec",price:1.5},
    {name:"básico",id:"ba",price:3.6},{name:"básico + entrada",id:"be",price:5.2},
    {name:"menú",id:"me",price:6.7}],dishes:{intro:[{name:"Ensalada variada",
    in_menu:["be"]},{name:"Ensalada de betarragas",in_menu:["me"]}],main:
    [{name:"Escabeche de pescado , camote, arroz",in_menu:["ba","be"]},
    {name:"Lomito de hígado, papa frita , arroz",in_menu:["me"]},
    {name:"Tortilla de verduras, arroz",in_menu:["ec"]}],extras:[{name:"Pan",
    in_menu:["ba","be","ec","me"]},{name:"Refresco o Leche",in_menu:
    ["ba","be","ec","me"]},{name:"Mousse de fruta",in_menu:["me"]}]}};
  res.send(example);
}

exports.getSimpleMenu = function(req, res) {
  Restaurant.getSimpleMenu(req.params.restId, function(err, model) {
    if (err) res.send({err: console.log(err)});
    res.send(model);
  })
}

exports.updateSimpleMenu = function(req, res) {
  Restaurant.updateSimpleMenu(req.params.restId, req.body, function(err, model) {
    if (err) res.send({err: console.log(err)});
    res.send(model);
  })
}