var React = require('react');

var FbPreview = React.createClass({

  render: function() {
    this.props.url = 'https://www.facebook.com/164255087049670/posts/580731158735392';
    return (
      <div className=''> 
        <section className='box'> 
            <a className='image featured'>
              <div className='box-separator' /> 
            </a>
            <div className = "fb-post" 
              data-href = {this.props.url} />
        </section>
      </div>
    );
  }
});

module.exports = FbPreview;