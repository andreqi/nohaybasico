module.exports = {
  error: function(msg) {
    var msg = msg || "Algo malo pasó :(";
    swal("Oops...", msg, "error");
  },
  success: function(msg) {
    swal("Yeah!", msg, "success");
  },
  login: function() {
    var htmlData = '<div class="popup">'+
      '<div>Para realizar esta acción tienes que logearte</div>'+
      '<ul class="social">'+
        '<li><a href="/auth/facebook" class="icon fa-facebook"></a></li>'+
        '<li><a href="/auth/twitter" class="icon fa-twitter"></a></li>'+
      '</ul>'+
    '</div>';

    swal({
      title: 'Login',
      text: htmlData,
      html: true,
      showConfirmButton: false,
      animation: "slide-from-top"
    });
  }
}