var React = require('react');
var _ = require('lodash');

var MenuImage = require('./MenuImage.jsx');
var SubmitImage = require('./SubmitImage.jsx');
var Api = require('../util/Api');

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

  removePhoto: function(idx) {
    this.setState({
      images: this.state.images.splice(idx, 0)
    });
  },

  renderPreUpload: function() {
    return (
      <button onClick = {this.validateAuth}>Subir imagen</button>
    )
  },

  loadImages: function () {
    var indexPhoto = this.state.indexPhoto;
    var images = this.state.images;

    indexPhoto = this.state.indexPhoto + 3 <= images.length ? 
                  this.state.indexPhoto + 3: images.length
    
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

  renderLoadMore: function(show) {
    if (!show) return null;
    return (
      <div className='12u'> 
        <a className='12u button alt add-more-images'
           onClick={this.loadImages}>
            Cargar Más
        </a>
      </div>
    )
  },

  render: function () {
    _this = this;
    var loadMore = this.state.indexPhoto < this.state.images.length;
    var images = this.state.images.map(function(image, i) {
      if (image.show) {
        return <MenuImage 
          key = {i} 
          {...image} 
          idx = {i} 
          removePhoto= {_this.removePhoto} 
          idRest = {_this.props.id} />
      }
    });

    return (
      <div className = 'container'>
      <div className='row columns'>
          {this.state.login}
          <SubmitImage
            userLog = {this.props.userLog}
            idRest = {this.props.id} />
          {images}
          {this.renderLoadMore(loadMore)}
        </div>
      </div>
    ); 
  },
});

module.exports = Galery;
