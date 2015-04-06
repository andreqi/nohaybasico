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
    var url = 'https://www.facebook.com/'+ fbPost.idPage +
                    '/posts/' + fbPost.idPost;
    return (
      <div className='container'>
        <div className='row'>
          <div className='-3u 6u'>
            <section className='box'> 
                <a className='image featured'>
                  <div className='box-separator' /> 
                </a>
                <div className = "fb-post" 
                  data-href = {url}>
                </div>
                <Loader msg = 'Cargando' />
            </section>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FbPreview;