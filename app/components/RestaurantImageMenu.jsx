var React = require('react');

var RestaurantImageMenu = React.createClass({
  render: function () {
    return (
      <div className='restaurant-img'>
        This is an image
        <button className='up-button'>
          Up
        </button>
        <button className='down-button'>
          Down
        </button>
      </div>
    ); 
  },
});

module.exports = RestaurantImageMenu;
