var React = require('react');
var _ = require('lodash');

var MenuImage = require('./MenuImage.jsx');
var SubmitImage = require('./SubmitImage.jsx');
var Api = require('../util/Api');
var Alert = require('../util/Alert');
var Loader = require('../util/Loader.jsx');

var Galery = React.createClass({
  
  getInitialState: function () {
    var photos = this.handlePhotos(this.props.photos);
    return {
      images: photos,
      login: null,
      loader: null,
      indexPhoto: 2 < photos.length? 2: photos.length
    }; 
  },

  handlePhotos: function(photos) {
    for (var i = 0, len = photos.length; i < len; i++) {
      var show = false;
      if (i < 2) {
        show = true;
      }
      photos[i].show = show;
    };
    return photos;
  },

  handleUpdatedPhotos: function(photos) {
    var images = this.handlePhotos(photos);
    this.setState({
      images: photos,
      indexPhoto: 2 < images.length? 2: images.length 
    });
  },

  updatePhotos: function() {
    this.setState({
      loader: <Loader msg = 'Actualizando fotos' /> 
    });
    var self = this;
    Api.consume('updatePhotos', {}, {idRest: this.props.tagName},
      function(err, res) {
        self.setState({loader: null});
        if (err) {
          return Alert.error();
        }
        self.handleUpdatedPhotos(res.images);
      }
    )
  },

  removePhoto: function(idx) {
    var images = this.state.images;
    images.splice(idx, 1);
    this.setState({
      images: images,
      indexPhoto: this.state.indexPhoto - 1
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
    var addMoreButton = null;
    console.log('addMoreButton', show);
    if (show) {
      addMoreButton = (
        <a className='-1u 7u button alt add-more-images'
           onClick={this.loadImages}>
          Cargar Más
        </a>
      )
    }
    return (
      <div className='12u'> 
        <a className='3u button alt' 
          onClick = {this.updatePhotos}>
          <i className = 'icon fa-refresh' />
          <span className = 'mar-left' >Actualizar fotos</span>
        </a>
        {addMoreButton}
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
          {this.state.loader}
          {this.renderLoadMore(loadMore)}
        </div>
      </div>
    ); 
  },
});

module.exports = Galery;
