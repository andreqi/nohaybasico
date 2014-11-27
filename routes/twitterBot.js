var rest_logic = require('./../logic/restaurants');

var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

exports.index = function(req, res) {
  var dish = req.params.dish;
  var restaurants = req.params.restaurants;
  var date = new Date();
  var day = days[date.getDay()];
  rest_logic.get_restaurants_twitter(
    dish, restaurants,
    function(data) {
      console.log(data.restaurants);
      res.render('twitter-bot-index', {
        dish: dish,
        cur_day: day,
        menu_active: true,
        restaurants: data.restaurants
      });
    }
  );
}