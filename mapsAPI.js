var request = require('request');
var env = require('./env.js');

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
