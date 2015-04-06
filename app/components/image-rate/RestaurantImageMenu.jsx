var React = require('react');
var Api = require('../util/Api');

var UpVote = require('./UpVote.jsx');
var DownVote = require('./DownVote.jsx');
var Alert = require('../util/Alert');

var RestaurantImageMenu = React.createClass({

  getInitialState: function() {
    return {
      positiveVotes: this.props.positiveVotes,
      negativeVotes: this.props.negativeVotes,
      ownVote: this.props.ownVote
    };
  },

  vote: function(action) {
    var self = this;
    var data = {path: this.props.path};
    Api.consume(action, data, {idRest: this.props.idRest}, 
      function(err, res) {
        if (err && err.code === 401) {
          return Alert.login();
        }
        var positiveVotes = self.state.positiveVotes;
        var negativeVotes = self.state.negativeVotes;

        if (self.state.ownVote && self.state.ownVote > 0) {
          positiveVotes--;
        }

        if (self.state.ownVote && self.state.ownVote < 0) {
          negativeVotes--;
        }

        if (action === 'voteUp') {
          positiveVotes++;
        }

        if (action === 'voteDown') {
          negativeVotes++;
        }

        self.setState({
          positiveVotes: positiveVotes,
          negativeVotes: negativeVotes,
          ownVote: action === 'voteUp'? 1: -1
        });
      }
    );
  },

  voteUp: function() {
    this.vote('voteUp');
  },

  voteDown: function() {
    this.vote('voteDown');
  },

  removePhoto: function() {
    var data = {path: this.props.path};
    var self = this;
    Api.consume('removePhoto', data, {idRest: this.props.idRest},
      function(err, res) {
        self.props.removePhoto(self.props.idx);
      }
    );
  },

  render: function () {
    var remove = null;
    if (this.props.canDelete) {
      remove = <div className = 'remove button' onClick = {this.removePhoto} >
        <i className = 'icon fa-trash remove-photo' />
        Eliminar foto
      </div>
    }
    return (
      <div className='restaurant-img'>
        <div className='author'>
          Gracias a
          <span className = 'name'>{this.props.userName}</span>
        </div>
        <img src = {this.props.path} />
        <UpVote 
          onClick = {this.voteUp} 
          active = {this.state.ownVote > 0}
          score = {this.state.positiveVotes} />
        <DownVote 
          onClick = {this.voteDown}
          active = {this.state.ownVote < 0}
          score = {this.state.negativeVotes} />
        {remove}
      </div>
    ); 
  },
});

module.exports = RestaurantImageMenu;
