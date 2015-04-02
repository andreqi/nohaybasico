var React = require('react');
var _ = require('lodash');

var Restaurant = require('./Restaurant.jsx');

var RestaurantList = React.createClass({
  renderAddContact: function() {
    return (
      <div className='4u'> 
        <section className='box'> 
          <a className='image featured'>
            <div className='box-separator' /> 
          </a>
          <header>
            <div className='same-line'>
              <h3 className='same-line'>
                ¿No encuentras tu restaurant?
              </h3>
            </div>
            <footer>        
              <a className='button alt'
                 href={'/contact/add'} >
                 Agregar restaurant
              </a>
            </footer>
          </header>
        </section>
      </div>
    )
  },

  render: function () {
    return (
      <div className='row columns'>
      {_.map(this.props.restaurants, function (rest, idx) {
        return <Restaurant key={idx} {...rest} />;
      })}
      {this.renderAddContact()}
      </div>
    ); 
  },
});

module.exports = RestaurantList;
