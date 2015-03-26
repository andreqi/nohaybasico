var React = require('react');

var RestaurantImageMenu = require('../image-rate/RestaurantImageMenu.jsx');

var Restaurant = React.createClass({

  getInitialState: function () {
    return {
      view: 'lista',
    };
  },

  renderHeader: function () {
    return (
      <header>
        <div className='same-line'>
          <h3 className='same-line'>        
            {this.props.name}
          </h3>
        </div>
        <div className='vertical-middle'>
          <span>S/. {this.props.priceRange}</span>
          <a href="/el-tio-bigote/info" className = "pull-right button small"> 
            <img src="public/images/walking2.png" />
            <span>5 mins</span>
          </a>
        </div> 
      </header>
    );
  },

  renderBody: function () {
    var status = this.props.updated ? 'Menú listo': 'Pera ya viene';

    /*if (this.state.view !== 'lista') {
      return <RestaurantImageMenu /> 
    }

    var dishes = [];
    for (var idx = 0; idx < 5 && this.props.dish_preview; idx++) {
      var value = '';
      if (idx < this.props.dish_preview.length) {
        value = this.props.dish_preview[idx].name;
      }
      dishes.push(
        <li key={idx} className='12u'>{value}</li>
      ); 
    }*/
    return (
      <div className='row'>
        <div>{status}</div>
      </div>
    );
  },

  toggleView: function () {
    var next = this.state.view == 'lista' ? 'img' : 'lista';  
    this.setState({ view : next });
  },

  renderFooter: function () {

    //var redirect = this.props.dishes ? 'menu' : 'carta';
    var redirect = 'galery';
    return (
      <footer>        
        <a className='button alt'
           href={'/'+this.props.tagName+'/'+redirect}>
           Ver más
        </a>
        <a className='button alt'
           href={'/'+this.props.tagName+'/fbPreview'}>
           Ver más
        </a>
        <span>  </span>
        <a className='button alt' 
           onClick={this.toggleView}>
           { this.state.view == 'lista' ?  'Imagen' : 'Lista' }
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
