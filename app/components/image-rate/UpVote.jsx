var React = require('react');
var ClickableMixin = require('../util/mixins/ClickableMixin');

var UpVote = React.createClass({

  render: function () {
    var active = this.props.active ? 'active': '';
    return (
      <div className={active +' vote vote-up'}
           onClick = {this.props.onClick.bind(null, this)} >
          <i className = 'icon fa-thumbs-up' />
          {this.props.score}
      </div>
    ); 
  },
});

module.exports = UpVote;
