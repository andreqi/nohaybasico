var express = require('express'); 
var app = express(); 

var port = 4321;
app.listen(port);

app.get('/', function(req, res) {
  res.render('main', {restaurants: [{name: 'Marinsa'}, {name: 'Tio Bigote'}]});
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
