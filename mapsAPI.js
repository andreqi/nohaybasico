var request = require('request');
var env = require('./env.js');

var getTimesFromPucp = function (lat, lng) {
  var url = 'http://maps.googleapis.com/maps/api/directions/json?' +
            'sensor=false&mode=walking';    
  var coordsPuerta = [{lat: -12.068813, lng: -77.077996}, 
                      {lat: -12.071499, lng: -77.078366}];
  for (var idx = 0; idx < 2; idx++) {
     var req = request([
                url, 
                'origin='+formatCoord({lat: lat, lng: lng}), 
                'destination='+formatCoord(coordsPuerta[idx])
               ].join('&'), function(error, res, body) {
        console.log(body);           
      }); 
  }
};

module.exports.getTimesFromPucp = getTimesFromPucp;

module.exports.createReadStream = function(lat, lng, imgSize, zoom){
  var url = 'https://maps.googleapis.com/maps/api/staticmap?center=(' + lat + 
            ',' + lng +')&key=' + env.GMAPS_KEY;
  var markers = 'markers=|(' + lat + ',' + lng + ')';
  var defaultSize = imgSize || {width: 600, height: 300};  
  var size = 'size=' + defaultSize.width + 'x' + defaultSize.height;
  var zoom = 'zoom=' + (zoom || 16);
  url = [url, markers, size, zoom].join('&');
  return request(url); 
};    

module.exports.getMapsRedirectURL = function (lat, lng) {
  return 'http://maps.google.com/maps?q=' + lat + ',' + lng;
} 
