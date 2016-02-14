var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var TweetStore = new Store(AppDispatcher);


var _tweets = {};
var _keyword_hash = {};

TweetStore.tweets = function(){
  return _tweets;
}

TweetStore.keyword_hash = function(){
  _words = [];
  return _keyword_hash;
}

TweetStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case "AUTHOR_TWEETS_RECEIVED":
      _keyword_hash = payload.tweets["keyword_hash"];
      _tweets = payload.tweets["tweets"];
      TweetStore.__emitChange();
      break;
  }
};

module.exports = TweetStore;
