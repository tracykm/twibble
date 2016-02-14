var React = require('react');
var AppDispatcher = require('../dispatcher/dispatcher.js');
var TweetStore = require('../stores/tweetStore.js');
var SearchForm = require('./searchForm')
var makeBubbleChart = require('./../bubble.js');
var ApiUtil = require('../util/apiUtil')

module.exports = React.createClass({
  getInitialState: function () {
    return( {tweets: []} )
  },
  componentDidMount: function(){
    var that = this;
    this.tweetListener = TweetStore.addListener(this._updateTweets);
    $("#vis").on( "click", function(e){
      var keyword = e.target.textContent
      var tweetIds = TweetStore.keyword_hash()[keyword];

      var tweets = TweetStore.tweets();
      var selectedTweets = [];
      tweetIds.forEach(function(id){
        selectedTweets.push(tweets[id].text);
      });

      debugger
      that.setState({tweets: selectedTweets})
    });
  },
  _updateTweets: function(){
    var keyword_hash = TweetStore.keyword_hash();
    var tweets = TweetStore.tweets();

    var data = [];
    var i = 0;
    for (keyword in keyword_hash) {
      data.push({word: keyword, id: i, total_amount: keyword_hash[keyword].length+2, group: "low", tweet_ids: keyword_hash[keyword]})
      console.log(keyword_hash[keyword]);
      i++;
    }
    // console.log(TweetStore.words());
    makeBubbleChart.clear();
    makeBubbleChart.render(data);
    // this.setState({tweets: TweetStore.keyword_hash.keys()})
  },
  _search: function(e){
      var searchTerm = e.target.textContent;
      if(!searchTerm){
        searchTerm = e.target
      }
      document.querySelector("#searchTerm").value = searchTerm;
      ApiUtil.getRecentTweetsBy("@"+searchTerm);
  },
  render: function (e) {
    var formatedTweets = this.state.tweets.map(function(tweet){
      return (<p>{tweet}</p>);
    })
    console.log(formatedTweets);
    twitterAccounts = ["chuck_facts", "DeathStarPR", "TheTweetOfGod", "kellyoxford", "MensHumor", "carellquotes", "SenSanders"]
    twitterAccounts = twitterAccounts.map(function(account){
      return(
        <li className="link">@{account}</li>
      )
    })
    return(
      <div>
        <h1>Visualize Twitter Accounts</h1>
        <SearchForm/>
        <ul onClick={this._search} id="twitterAccounts">
          {twitterAccounts}
        </ul>
        <div className="loader spinner">Loading...</div>
        <div id="vis"></div>
        {formatedTweets}
      </div>
    );
  }
});
