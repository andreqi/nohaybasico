var Photo = require('../models/Photo')

exports.add = function(req, res) {
  var path = req.files.photo.path;
  var userId = '54ff995ab0bccbb401bd3df9';
  var params = {
    createdBy: userId,
    path: path,
    restaurant: req.params.restId
  }
  console.log(params);
  Photo.addPhoto(params, function(err, model) {
    err = err || '';
    res.send({
      err: err,
      path: path
    });
  })
};

exports.delete = function(req, res) {
  Photo.removePhoto(req.body.path, function(err) {
    err = err || '';
    res.send({
      err: err
    });
  });
}