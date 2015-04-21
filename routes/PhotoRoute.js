var Photo = require('../models/Photo')

exports.add = function(req, res) {
  var path = req.files.photo.path;
  var params = {
    createdBy: req.user._id,
    userName: req.user.name,
    path: path,
    restaurant: req.params.restId
  }
  Photo.addPhoto(params, function(err, model) {
    err = err || '';
    res.send({
      err: err,
      path: path
    });
  })
};

exports.delete = function(req, res) {
  var params = {
    restaurant: req.params.restId,
    path: req.body.path
  }
  Photo.removePhoto(params, function(err) {
    err = err || '';
    res.send({
      err: err
    });
  });
};

exports.voteUp = function(req, res) {
  Photo.voteUp({
      path: req.body.path,
      userId: req.user._id
    },
    function(err) {
      err = err || '';
      res.send({
        err: err
      }); 
    }
  )
};

exports.voteDown = function(req, res) {
  console.log('voteDown');
  Photo.voteDown({
      path: req.body.path,
      userId: req.user._id
    },
    function(err) {
      err = err || '';
      res.send({
        err: err
      }); 
    }
  )
}