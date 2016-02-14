var ApiActions = require('../actions/apiActions.js');

module.exports = {
  getRecentTweetsBy: function(author){
    showLoading();
    $.ajax({
      url: "api/authors/" + author,
      success: function(tweets) {
        hideLoading();
        ApiActions.receiveAuthorTweets(tweets);
      },
      error: function(){
        hideLoading();
      }
    });
  }

}

function showLoading(){
  $(".loader").show();
  $("#vis").hide();
}
function hideLoading(){
  $(".loader").hide();
  $("#vis").show();
}
