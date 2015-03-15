var React = require('react');

var Restaurant = require('./Restaurant.jsx');

var RestaurantList = React.createClass({
  render: function () {
    return (
        <div className='row columns'>
            <Restaurant />
            <Restaurant />
            <Restaurant />
            <Restaurant />
        </div>
    ); 
  },
});

module.exports = RestaurantList;
