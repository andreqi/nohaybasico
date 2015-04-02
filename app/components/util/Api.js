var _ = require('lodash');

module.exports = (function() {
  var post = function(url, data, cb) {
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data) || {},
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      success: function(res){
        cb(null, res);
      },
      error: function(jqXHR, textStatus, errorThrown ){
        cb({msg: errorThrown, code: jqXHR.status});
      }
    });
  };

  var urls = {
    'voteUp': '/restaurant/<%= idRest %>/photo/voteUp',
    'voteDown': '/restaurant/<%= idRest %>/photo/voteDown',
    'auth': '/auth',
    'removePhoto': '/restaurant/<%= idRest %>/photo/delete',
    'contact': '/contact'
  }

  return {
    consume: function(name, data, params, cb) {
      url = urls[name];
      if (typeof params == 'function') {
        cb = params;
      } else {
        var compiled = _.template(url);
        url = compiled(params);
      }
      post(url, data, cb);
    }
  }
})();
