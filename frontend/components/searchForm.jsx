var React = require('react');
var ApiUtil = require('../util/apiUtil')

// var LinkedStateMixin = require('react-addons-linked-state-mixin');


module.exports = React.createClass({
  // mixins: [LinkedStateMixin],
  _search: function(e){
      e.preventDefault();
      var searchTerm = document.querySelector("#searchTerm").value;
      ApiUtil.getRecentTweetsBy("@"+searchTerm);
  },
  render: function () {
    return(
      <form onSubmit={this._search}>
        @<input id="searchTerm" type="text"></input>
          <input type="submit" value="Submit"></input>
      </form>
    );
  }

});
