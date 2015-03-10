var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

var App = React.createFactory(require('./components/App.jsx'));

var app = {
    start: function(props) {
        if (ExecutionEnvironment.canUseDOM) {
            var DOM = document.getElementById('component');
            if (DOM) {
                React.render(
                    App(props), 
                    DOM
                ); 
            }
        } else {
            return React.renderToString(App(props));
        }
    },
};

if (ExecutionEnvironment.canUseDOM) {
    var domProps = document.getElementById('props');
    var props = {};
    if (domProps) {
        props = JSON.parse(domProps.innerHTML); 
    }
    app.start(props);
}

module.exports = app;
