var React = require('react');
var ClickableMixin = require('../util/mixins/ClickableMixin');

var DownVote = React.createClass({

  render: function () {
    var active = this.props.active ? 'active': '';
    return (
      <div className={active +' vote vote-down'}
           onClick = {this.props.onClick.bind(null, this)} >
          {this.props.score}
          <i className = 'icon fa-thumbs-down' />
      </div>
    ); 
  }
});

module.exports = DownVote;
