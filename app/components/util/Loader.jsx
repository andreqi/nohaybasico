var React = require('react');

var Loader = React.createClass({
  getDefaultProps: function() {
    return {
      msg: 'Enviando'
    };
  },

  render: function() {
    return (
      <div className= 'loader'>
        <div>
          {this.props.msg}
          <img src= "/public/svg/loader-black.svg" />
        </div>
      </div>
    );
  }
});

module.exports = Loader;