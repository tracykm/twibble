var React = require('react');
var ReactDOM = require('react-dom');
var MyComponent = require('./components/myComponent.jsx');
// var Comparison = require('./components/comparison.jsx');
var d3 = require('./libs/d3.js');

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(<MyComponent />, document.getElementById('main'));
});

console.log("boo");
