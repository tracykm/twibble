json.keyword_hash @keyword_hash

hash_tweets = {}
@tweets.each do |tweet|
  hash_tweets[tweet.id/10000] = {text: tweet.text, created_at: tweet.created_at}
end
  json.tweets hash_tweets
  # json.array!(@tweets) do |tweet|
  #   json.partial!('tweet', tweet: tweet)
  # end
# end
