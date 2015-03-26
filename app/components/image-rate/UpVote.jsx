var React = require('react');
var ClickableMixin = require('../util/mixins/ClickableMixin');

var UpVote = React.createClass({
  mixins: [ClickableMixin],

  getDefaultProps: function () {
    return { score: 10 };
  },


  render: function () {
    return ( 
      <div className={this.getClass() +
                      ' up-button rate-box'}
          onMouseDown={this.addActiveClass}
          onMouseUp={this.removeActiveClass}
          onClick = {this.props.onClick.bind(null, this)} >

        <span className='line short' />
        <span className='line long' />
        <span className='score' >
          {this.props.score}
        </span>
      </div>
    );
  },
});

module.exports = UpVote;
