var React = require('react');


var SubmitImage = React.createClass({
  render: function () {
    return (
      <div className='4u'>  
        <section className='box'>
          <a className='image featured'>
            <div className='box-separator' />
          </a>
          <button className='restaurant-img submit-button'>
            +
            Agregar Imagen
          </button>
        </section>
      </div>
    );   
  },
});

module.exports = SubmitImage;
