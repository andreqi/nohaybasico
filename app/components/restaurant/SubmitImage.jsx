var React = require('react');
var Alert = require('../util/Alert');
var Loader = require('../util/Loader.jsx');

var SubmitImage = React.createClass({
  getInitialState: function() {
    return {
      fileSelected: 'Seleccionar...',
      error: false,
      loader: null
    };
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (!this.refs.file.getDOMNode().files.length) {
      this.setState({error: true});
      return;
    }
    this.setState({
      loader: <Loader />
    })
    var self = this;
    var options = {
      error: function(err, f2, f3) {
        if (err.status === 401) {
          self.setState({loader: null})
          return Alert.login();
        }
        Alert.error();
      },
      success: function(response) {
        self.setState({loader: null})
        var msg = 'Imagen subida. Debes actualizar fotos para ver la imagen nueva';
        Alert.success(msg);
      }
    }

    $(e.target).ajaxSubmit(options);
  },

  onChange: function(e) {
    var text = e.target.value.split(/(\\|\/)/g).pop() || 
              'Seleccionar...';
    this.setState({
      fileSelected: text,
      error: false
    });
  },

  showLogin: function() {
    Alert.login();
  },

  render: function () {
    var url = '/restaurant/'+this.props.idRest+'/photo';
    var view =  <button 
                  className = 'button'
                  onClick = {this.showLogin}>
                    Subir imagen
                </button>
    var errorClass = 'error ' + (this.state.error ? 'show': 'hide');
    if (this.props.userLog) {
      view = (
        <form 
        action = {url}
        encType = "multipart/form-data"
        method = "post"        
        onSubmit={this.handleSubmit}>
          <div className = {errorClass}>Selecciona archivo</div>
          <div className = 'upload'>
            <input 
              type = "button" 
              className = "uploadButton" 
              value="Buscar Imagen" />
            <input 
              type = "file" 
              ref = "file" 
              name = "photo" 
              onChange ={this.onChange} 
              accept="image/*" capture />
            <div className = "fileName">
              {this.state.fileSelected}
            </div>
          </div>
          <button className = 'button alt'>Subir Imagen</button>
          {this.state.loader}
        </form>
      )
    }

    return (
      <div className='4u'>  
        <section className='box'>
          <a className='image featured'>
            <div className='box-separator' />
          </a>
          {view}    
        </section>
      </div>
    );   
  },
});

module.exports = SubmitImage;
