var React = require('react');
var ClickableMixin = require('../util/mixins/ClickableMixin');

var DownVote = React.createClass({
  mixins: [ClickableMixin],

  getDefaultProps: function () {
    return { score: 10 };
  },

  render: function () {
    return (
      <div className={this.getClass() +
                      ' down-button rate-box'}
           onMouseDown={this.addActiveClass} 
           onMouseUp={this.removeActiveClass} 
           onClick = {this.props.onClick.bind(null, this)} >
        <span className='line left' />
        <span className='line right' />
        <span className='score' 
              onClick={this.doNothing}>
          {this.props.score}
        </span>
      </div>
    ); 
  }
});

module.exports = DownVote;
