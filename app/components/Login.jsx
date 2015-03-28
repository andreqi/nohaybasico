var React = require('react');

var Login = React.createClass({
  componentDidMount: function() {
    console.log('open', this.refs.login.getDOMNode());
    this.refs.login.getDOMNode().showModal();
  },
  render: function() {
    return (
      <div>
        <dialog ref = 'login' >
          <h2>Login</h2>
            <a href='/auth/facebook'>fb</a>
            <a href='/auth/twitter'>twitter</a>
        </dialog>
      </div>
    );
  }

});

module.exports = Login;