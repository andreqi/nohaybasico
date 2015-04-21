var React = require('react');

var Api = require('./util/Api');
var Alert = require('./util/Alert');
var Loader = require('./util/Loader.jsx');

var Contact = React.createClass({
  getInitialState: function() {
    return {
      contactInfo: '',
      content: '',
      error: [false, false, false],
      loader: null
    };
  },

  handleChange: function(e) {
    this.setState({
      contactInfo: e.target.value 
    });
  },

  updateField: function(idx) {
    var error = this.state.error;
    error[idx] = false;
    this.setState({
      error: error
    });
  },

  updateContent: function(e) {
    this.setState({
      content: e.target.value 
    });
    this.updateField(2);
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var error = this.state.error;
    var errorInForm = false;
    var data = {
      feel: this.refs.selectFeel.getDOMNode().value,
      body: this.state.content,
      type: this.refs.selectRequest.getDOMNode().value,
      contactInfo: this.state.contactInfo
    }
    if (data.type === 'Elegir') {
      errorInForm = error[0] = true;
    }
    if (data.feel === 'Elegir') {
      errorInForm = error[1] = true;
    }
    if (!data.body.length) {
      errorInForm = error[2] = true;
    }
    if (!errorInForm) {
      console.log('send');
      this.setState({
        loader: <Loader />
      })
      var self = this;
      Api.consume('contact', data, function(err, res) {
        self.setState({loader: null})
        if (err || res.err) {
          return Alert.error('Información no pudo ser enviada. Intenta denuevo');
        }
        Alert.success('Información enviada');
      })
    } else {
      this.setState({
        error: error
      });
    }    
  },

  renderSelect: function(options) {
    return options.map(function(item, i) {
      return (
        <option
          key = {i} 
          value = {item} >
          {item}
        </option>
      )
    })
  },

  render: function() {
    var defaultRequest = this.props.typeRequest || 'Elegir';
    var optionsRequest = ['Elegir', 'Nuevo restaurante', 'Sugerencia',
                          'Error', 'Quiero apoyar', 'Otra cosa'];
    var backButton = <a href = '/' className = 'button' >Atrás</a>
    if (this.props.tagName) {
      backButton = null;
      optionsRequest = ['Elegir', 'Sugerencia', 'Queja','Otra cosa'];
    }
    var optionsFeel = ['Elegir', 'Feliz', 'Entusiasmado', 'Cansado',
                       'Molesto', 'Triste'];
    var selectRequestClass = 'error '+ (this.state.error[0]? 'show': 'hide');
    var selectFeelClass = 'error '+ (this.state.error[1]? 'show': 'hide');
    var contentClass = 'error '+ (this.state.error[2]? 'show': 'hide');
    return (
      <div className = 'container contact' >
        <div className = 'row' >
          <form 
            className = '6u -3u'
            onSubmit = {this.handleSubmit}>

            <div className = 'fields'>
              <div className={selectRequestClass}>
                Elige un tipo
              </div>
              <label>Tipo: </label>
              <select 
                onChange={this.updateField.bind(null, 0)}
                ref='selectRequest'
                defaultValue = {defaultRequest} >
                {this.renderSelect(optionsRequest)}
              </select>
            </div>

            <div className = 'fields' >
              <div className={selectFeelClass}>
                Tú puedes, elige uno
              </div>
              <label>¿Cómo te sentiste?</label>
              <select 
                onChange={this.updateField.bind(null, 1)}
                ref='selectFeel'
                defaultValue='Elegir' >
                {this.renderSelect(optionsFeel)}
              </select>
            </div>

            <div className = 'fields'>
              <label>Contacto (si deseas una repuesta)</label>
              <input type = 'text' onChange = {this.handleChange} />
            </div>

            <div className = 'fields'>     
              <div className={contentClass}>
                Da flojera, pero puedes llenarlo
              </div>
              <label>Comentarios</label>
              <textarea 
                value={this.state.content}
                onChange={this.updateContent}/>
            </div>
            <div className='fields action-btns'>
              {backButton}
              <input type = 'submit' value = 'Enviar' />
              {this.state.loader}
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Contact;