var React = require('react');
var AppDispatcher = require('../dispatcher/dispatcher.js');
var TweetStore = require('../stores/tweetStore.js');
window.TweetStore = require('../stores/tweetStore.js');
var SearchForm = require('./searchForm')
var makeBubbleChart = require('./../bubble.js');
var ApiUtil = require('../util/apiUtil')

module.exports = React.createClass({
  getInitialState: function () {
    this.searchTerm = "DeveloperWeek"
    return( {tweets: []} )
  },
  componentDidMount: function(e){
    var that = this;
    this._updateTweets();
    this.tweetListener = TweetStore.addListener(this._updateTweets);
    $("#vis").on( "click", function(e){
      if(!e.target.parentElement.classList.contains("gnode")){
        return;
      }
      var keyword = e.target.textContent
      if(!keyword){
        var keyword = e.target.parentElement.children[1].textContent
      }
      this.searchTerm = keyword;
      var tweetIds = TweetStore.keyword_hash()[keyword];

      var tweets = TweetStore.tweets();
      var selectedTweets = [];
      tweetIds.forEach(function(id){
        selectedTweets.push(tweets[id].text);
      });

      that.setState({tweets: selectedTweets});
      window.scrollTo(0,document.body.scrollHeight);
    });
  },
  _updateTweets: function(){
    var keyword_hash = TweetStore.keyword_hash();
    var tweets = TweetStore.tweets();

    var data = [];
    var i = 0;
    for (keyword in keyword_hash) {
      data.push({word: keyword, id: i, total_amount: keyword_hash[keyword].length+1, group: "low", tweet_ids: keyword_hash[keyword]})
      i++;
    }
    if(data === []){
      $("#tweets").text = "No user found";
      alert("no tweets");
    }
    makeBubbleChart.clear();
    makeBubbleChart.render(data);
    // this.setState({tweets: TweetStore.keyword_hash.keys()})
  },
  _search: function(e){
      var searchTerm = document.querySelector("#searchTerm").value;
      this.setState({tweets: []})
      ApiUtil.getRecentTweetsBy("@"+searchTerm);
  },
  handleFavAccountClick: function(e){
    var searchTerm = e.target.textContent;
    document.querySelector("#searchTerm").value = searchTerm;
    this._search();
  },
  render: function () {
    var formatedTweets = this.state.tweets.map(function(tweet){
      return (<p>{tweet}</p>);
    })
    twitterAccounts = ["chuck_facts", "DeathStarPR", "TheTweetOfGod", "kellyoxford", "MensHumor", "carellquotes", "SenSanders"]
    twitterAccounts = twitterAccounts.map(function(account){
      return(
        <li className="link">@{account}</li>
      )
    })
    return(
      <div>
        <h1>Visualize Twitter Accounts</h1>
        <SearchForm searchTerm={this.searchTerm}/>
        <ul onClick={this.handleFavAccountClick} id="twitterAccounts">
          {twitterAccounts}
        </ul>
        <div className="loader spinner">Loading...</div>
        <div id="vis"></div>
        <div id="tweets">
          {formatedTweets}
        </div>
      </div>
    );
  }
});
