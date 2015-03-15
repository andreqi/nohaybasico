var React = require('react');

var Restaurant = React.createClass({

    renderHeader: function () {
        return (
            <header>
                <div className='same-line'>
                    <h3 className='same-line'>        
                        Nombre de restaurant
                    </h3>
                </div>
                <div className='vertical-middle'>
                   <span>S/. 10.00</span>
                </div> 
            </header>
        );
    },

    renderBody: function () {
        return (
            <div className='row'>
                <ul>
                    <li className='12u'>Dish 1</li>
                    <li className='12u'>Dish 1</li>
                    <li className='12u'>Dish 1</li>
                    <li className='12u'>Dish 1</li>
                    <li className='12u'>Dish 1</li>
                </ul>
            </div>
        );
    },

    renderFooter: function () {
        return (
            <footer>        
                <a className='button alt'>Ver más</a>
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
