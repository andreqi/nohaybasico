module.exports = {
  getClass: function () {
    if (this.state) {
        return this.state.rootClass || ''; 
    } 
    return '';
  },

  addActiveClass: function () {
    this.setState({ rootClass: 'active' }); 
  }, 

  removeActiveClass: function () {
    this.setState({ rootClass: '' }); 
  }, 

  doNothing: function (e) {
    e.preventDefault();
  },
};
