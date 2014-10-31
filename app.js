var express = require('express'); 
var app = express(); 
var fs = require('fs');

var port = 4321;
app.listen(port);

app.get('/', function(req, res) {
  get_restaurants(function(data) {
    res.render('main', {restaurants: data});
  });
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function get_restaurants(callback) {
  fs.readdir('./restaurants', function(err, files) {
    files = files.filter(function(name) {return name[0] != '.'});
    var payback = files.map(function(data) {
      var strFile = fs.readFileSync('./restaurants/' + data, 'utf8');
      return JSON.parse(strFile); 
    });
    callback(payback);
  });
}
