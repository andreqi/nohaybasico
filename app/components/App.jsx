var React = require('react');

var Components = require('../constants/components');
var Galery = require('./restaurant/Galery.jsx');
var FbPreview = require('./restaurant/FbPreview.jsx');
var RestaurantList = require('./landing/RestaurantList.jsx');
var Contact = require('./Contact.jsx');

var App = React.createClass({
  render: function () {
    switch (this.props.component) {
      case Components.RESTLIST: 
        return <RestaurantList {...this.props} />;
      case Components.GALERIA: 
        return <Galery {...this.props} />;
      case Components.FBPREVIEW: 
        return <FbPreview {...this.props} />;
      case Components.CONTACT:
        return <Contact {...this.props} />;
      default: 
        return <div> Whoops </div>;
    }
  },  
});

module.exports = App;
