var request = require('request');
var moment = require('moment');

var config = require('../env');
var Restaurant = require('../models/Restaurant');

function saveData(newData) {
  Restaurant.updateFacebookMenu(newData._id, newData.facebookPost,
    function(err) {
      if (err) return console.log('save data', err);
      console.log('fb updated', newData._id, moment().format('MMMM Do YYYY, h:mm:ss a'));
    }
  )
}

function isValidMessage(message, pattern) {
  var rgex = new RegExp(pattern, 'g');
  var idx = message.search(rgex);
  return idx != -1;
}

function handleRequest(data, lastData) {
  if (!data.length) return;
  if (data[0].id === lastData.facebookPost.lastPost) {
    return;
  }
  var i;
  for (i = 0, len = data.length; i < len; i++) {
    if (isValidMessage(data[i].message, lastData.facebookPost.pattern)) {
      lastData.facebookPost.idPost = data[i].id.split('_')[1];
      lastData.facebookPost.msg = data[i].message;
      break;
    }
  };
  if (i < len) {
    lastData.facebookPost.lastPost = data[0].id;
    if (lastData.facebookPost.getPicture) {
      requestPicture(data[i].object_id,function(urlImg) {
        lastData.facebookPost.urlImg = urlImg;
        saveData(lastData);
      });
    }
    else saveData(lastData);
  }
}

function requestPicture(object_id, cb) {
  var urlPicture = 'https://graph.facebook.com/v2.2/'+object_id
                  + '?picture&access_token='
                  + config.facebook.id +'|' +config.facebook.secret;
  request({
    url: urlPicture,
    method: "GET",
    json: true
  }, function(error, response, body) {
      if (error) return console.log('requestPicture',object_id, error);
      var idx = parseInt(body.images.length / 4, 10);
      cb(body.images[idx].source);
  });
}

function requestPosts(elem) {
  var urlPosts = 'https://graph.facebook.com/v2.2/' + elem.facebookPost.idPage
    + '/posts?fields=id,message,object_id&access_token='
    + config.facebook.id +'|' +config.facebook.secret;

  request({
    url: urlPosts,
    method: "GET",
    json: true
  }, function (error, response, body){
      if (error) return console.log('requestPosts',elem.facebookPost.idPage, error);
      handleRequest(body.data, elem);
  });
}

function workHard(data) {
  for (var i = data.length - 1; i >= 0; i--) {
    requestPosts(data[i]);
  };
}

function doWork() {
  Restaurant.getListMenuUpdater(function(err, models) {
    if (!models.length) return;
    
    setInterval(function() {
      workHard(models);
    }, 60000);
  });  
}

function start() {
  console.log('MenuUpdater')
  doWork();
}

exports.start = start;