var React = require('react');

var MenuImage = require('./MenuImage.jsx');
var _ = require('lodash');

var Galery = React.createClass({
  
  getInitialState: function () {
    return {
      images: 6,
    }; 
  },

  loadImages: function () {
    this.setState({ images: this.state.images + 3 });  
  },

  render: function () {
    var images = [];
    for (var idx = 0; idx < this.state.images; idx++) {
      images.push(<MenuImage key={idx} />); 
    }
    return (
      <div className='row columns'>
        {images}
        <MenuImage key='form' />
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
