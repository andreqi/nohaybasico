var React = require('react');

var RestaurantImageMenu = require('../RestaurantImageMenu.jsx');

var MenuImage = React.createClass({
  render: function () {
    return (
      <div className='4u'>
        <section className='box'>
           <a className='image featured'>
              <div className='box-separator' /> 
           </a>
           <RestaurantImageMenu />
        </section>
      </div>
    );
  },
});

module.exports = MenuImage;
