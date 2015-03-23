var React = require('react');
var _ = require('lodash');

var Restaurant = require('./Restaurant.jsx');

var RestaurantList = React.createClass({
  render: function () {
    return (
      <div className='row columns'>
      {_.map(this.props.restaurants, function (rest, idx) {
        return <Restaurant key={idx} {...rest} />;
      })}
      </div>
    ); 
  },
});

module.exports = RestaurantList;
