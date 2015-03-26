var React = require('react');
var Api = require('../util/Api');

var UpVote = require('./UpVote.jsx');
var DownVote = require('./DownVote.jsx');

var RestaurantImageMenu = React.createClass({

  vote: function(action) {
    var self = this;
    var data = {path: this.props.path};
    Api.consume(action, data, {idRest: this.props.idRest}, 
      function(err, res) {
        if (err && err.code === 401) {
          self.props.showLogin();
        }
      }
    );
  },

  voteUp: function() {
    this.vote('voteUp');
  },

  voteDown: function() {
    this.vote('voteDown');
  },

  remove: function() {
    var data = {path: this.props.path};
    Api.consume('removePhoto', data, {idRest: this.props.idRest},
      function(err, res) {

      }
    );
  },

  render: function () {
    var remove = null;
    if (this.props.canDelete) {
      remove = <div onClick = {this.remove} >x</div>
    }

    return (
      <div className='restaurant-img'>
        {this.props.userName}
        <img src = {this.props.path} />
        {remove}
        <UpVote onClick = {this.voteUp} />
        <DownVote onClick = {this.voteDown}/>
      </div>
    ); 
  },
});

module.exports = RestaurantImageMenu;
