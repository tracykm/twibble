var React = require('react');
var AppDispatcher = require('../dispatcher/dispatcher.js');
var TweetStore = require('../stores/tweetStore.js');
var SearchForm = require('./searchForm')
var makeBubbleChart = require('./../bubble.js');
var ApiUtil = require('../util/apiUtil')

module.exports = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});
