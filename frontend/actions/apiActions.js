var Dispatcher = require('../dispatcher/dispatcher.js');


module.exports = {
  receiveAuthorTweets: function (tweets) {
    Dispatcher.dispatch({
      actionType: "AUTHOR_TWEETS_RECEIVED",
      tweets: tweets
    });
  }

}
