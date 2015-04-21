var React = require('react');
var Loader = require('../util/Loader.jsx');

var FbPreview = React.createClass({

  componentDidMount: function() {
    $('iframe').ready(function () {
      console.log('ready')  
    });
  },

  render: function() {
    var fbPost = this.props.restaurant.facebookPost;
    var img = null;
    if (fbPost.urlImg) {
      img = <img src ={fbPost.urlImg} />
    }
    return (
      <div className='container'>
        <div className='row'>
          <div className='-4u 4u'>
            <section className='box fbPost'> 
                <a className='image featured'>
                  <div className='box-separator' /> 
                </a>
                {fbPost.msg}
                {img}
            </section>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FbPreview;