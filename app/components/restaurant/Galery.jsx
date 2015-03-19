var React = require('react');
var _ = require('lodash');

var MenuImage = require('./MenuImage.jsx');
var SubmitImage = require('./SubmitImage.jsx');

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
