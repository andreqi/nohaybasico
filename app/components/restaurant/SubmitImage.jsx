var React = require('react');


var SubmitImage = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    var options = {
      error: function(err, f2, f3) {
        if (err.status === 401) {
          self.props.showLogin();
        }
        
      },
      success: function(response) {
        console.log(response);
      }
    }
    $(e.target).ajaxSubmit(options);
  },

  render: function () {
    var url = '/restaurant/'+this.props.idRest+'/photo';
    return (
      <div className='4u'>  
        <section className='box'>
          <a className='image featured'>
            <div className='box-separator' />
          </a>

          <form 
            encType = "multipart/form-data"
            method = "post"
            action = {url}
            onSubmit = {this.handleSubmit} >

            <input type="file" name="photo" accept="image/*" capture />
            <button type='submit'>
              Agregar Imagen
            </button>
          </form>
        </section>
      </div>
    );   
  },
});

module.exports = SubmitImage;
