var React = require('react');

var UpVote = require('./UpVote.jsx');
var DownVote = require('./DownVote.jsx');

var RestaurantImageMenu = React.createClass({
  render: function () {
    return (
      <div className='restaurant-img'>
        <img src="https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11037708_940647299300135_4773500517597554762_n.jpg?oh=753b7c55cc4406bbb33cd4d09ecbee26&oe=55B16E67&__gda__=1438202093_8878129d08038aa442f5303c1f444813" />
        <UpVote onClick={function () { console.log ('up'); }}/>
        <DownVote onClick={function () { console.log ('down') }}/>
      </div>
    ); 
  },
});

module.exports = RestaurantImageMenu;
