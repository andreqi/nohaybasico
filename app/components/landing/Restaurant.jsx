var React = require('react');

var RestaurantImageMenu = require('../image-rate/RestaurantImageMenu.jsx');

var Restaurant = React.createClass({

  getInitialState: function () {
    return {
      view: 'lista',
    };
  },

  renderHeader: function () {
    var url = '/'+this.props.tagName+'/info';
    return (
      <header>
        <div className='same-line'>
          <h3 className='same-line'>
            {this.props.name}
          </h3>
        </div>
        <div className='vertical-middle'>
          <span>S/. {this.props.priceRange}</span>
          <a href={url} className = "pull-right button small">
            <img src="public/images/walking2.png" />
            <span>5 mins</span>
          </a>
        </div>
      </header>
    );
  },

  renderMenuReady: function() {
    return (
      <div>Menú esta listo <i className = 'face icomoon-smile' /></div>
    )
  },

  renderMenuNotReady: function() {
    if (this.props.shouldUpdate.facebook) {
      return (
        <div>El menú aún no se postea en fb <i className = 'face icomoon-wondering' /> </div>
      )
    }
    
    return (
      <div>
        Aún no tenemos menú <i className = 'face icomoon-sad' />
        <a className='button small nice-green'
          href={'/'+this.props.tagName + '/view'}>
          Subir imagen
        </a>
      </div>
    )
  },

  renderBody: function () {
    var status = this.props.updated ? 
      this.renderMenuReady(): this.renderMenuNotReady();
    return (
      <div className='row'>
        {status}
      </div>
    );
  },

  renderFooter: function () {
    
    return (
      <footer>        
        <a className='button alt'
           href={'/'+this.props.tagName + '/view'} >
           Ver más
        </a>
      </footer>
    ); 
  },

  render: function () {
    return (
      <div className='4u'> 
        <section className='box'> 
           <a className='image featured'>
              <div className='box-separator' /> 
           </a>
           {this.renderHeader()}
           {this.renderBody()}
           {this.renderFooter()}
        </section>
      </div>
    );
  },
});

module.exports = Restaurant;
