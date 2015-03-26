var React = require('react');
var _ = require('lodash');

var MenuImage = require('./MenuImage.jsx');
var SubmitImage = require('./SubmitImage.jsx');
var Login = require('../Login.jsx');

var Galery = React.createClass({
  
  getInitialState: function () {
    var photos = this.props.photos;
    for (var i = 0, len = photos.length; i < len; i++) {
      var show = false;
      if (i < 2) {
        show = true;
      }
      photos[i].show = show;
    };
    return {
      images: photos,
      login: null,
      indexPhoto: 2 < photos.length? 2: photos.length
    }; 
  },

  showLogin: function() {
    this.setState({
      login: <Login />
    });
  },

  loadImages: function () {
    var indexPhoto = this.state.indexPhoto;
    var images = this.state.images;
    
    indexPhoto = this.state.indexPhoto + 2 <= images.length ? 
                  this.state.indexPhoto +2: images.length
    
    if (indexPhoto > this.state.indexPhoto) {
      for (var i = 0; i < indexPhoto; i++) {
        images[i].show = true;
      };
    }
    
    this.setState({
      indexPhoto: indexPhoto,
      images: images 
    });
  },

  render: function () {
    self = this;
    var images = this.state.images.map(function(image, i) {
      if (image.show) {
        return <MenuImage 
          key = {i} {...image} 
          idRest = {self.props.id} 
          showLogin = {self.showLogin} />
      }
    });
    /*for (var idx = 0; idx < this.state.images; idx++) {
      images.push(<MenuImage key={idx} {...this.state.images[i]}/>); 
    }*/
    return (
      <div className='row columns'>
        {this.state.login}
        <SubmitImage key='form' />
        {images}
        <div className='12u'> 
            <a className='12u button alt add-more-images'
               onClick={this.loadImages}>
                Cargar Más
            </a>
        </div>
      </div>
    ); 
  },
});

module.exports = Galery;
