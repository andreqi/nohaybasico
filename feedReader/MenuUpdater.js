var request = require('request');
var mongoose = require('mongoose');

var config = require('../env');
var Restaurant = require('../models/Restaurant');

mongoose.connect(config.db, function(err) {
  if (err) {
    console.log('err mongo connection', err);
    throw err;
  }
});

function saveData(newData) {
  Restaurant.updateFacebookMenu(newData.id, newData.facebookPost,
    function(err) {
      if (err) return console.log('save data', err);
      console.log('ok');
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
    console.log('neh')
    return;
  }
  var i;
  for (i = 0, len = data.length; i < len; i++) {
    if (isValidMessage(data[i].message, lastData.facebookPost.pattern)) {
      lastData.facebookPost.idPost = data[i].id.split('_')[1];
      break;
    }
  };
  if (i < len) {
    lastData.facebookPost.lastPost = data[0].id;
    saveData(lastData);
  }
}

function requestPosts(elem) {
  var urlPosts = 'https://graph.facebook.com/v2.2/' + elem.facebookPost.idPage
    + '/posts?fields=id,message&access_token='
    + config.facebook.id +'|' +config.facebook.secret;

  request({
    url: urlPosts,
    method: "GET",
    json: true
  }, function (error, response, body){
      if (error) return console.log('requestPosts', error);
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
    }, 10000);
  });  
}

function createRes() {
  var params = {
    name: 'rest1',
    active: true,
    updated: false,
    shouldUpdate: {
      facebook: true
    },
    facebookPost: {
      pattern: 'MENÚ DEL DÍA',
      idPage: '164255087049670',
      idPost: ''
    }
  }
  new Restaurant(params).save(function(err, done){
    console.log(done);
  })
}

doWork();
//createRes();