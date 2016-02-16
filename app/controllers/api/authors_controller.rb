require 'httparty'
require 'json'



class Api::AuthorsController < ApplicationController
  def show
    author = params[:id]
    client = Twitter::REST::Client.new do |config|
      config.consumer_key = "fXcZzKOXmZjY4iE0ImeETmEXh"
      config.consumer_secret = "ADePCTpqAhJezCN0MpsIzKJVCecrgfTURGu079RVeJSHcJfLuB"
      config.access_token = "3031279493-GYA814kt8GaKESYF5PuMtxAW5vRJ3q6D6es714n"
      config.access_token_secret = "ediZdDzg72XidcZLHyEvcexpw7TsgBovkrjpuc4hqLT8X"
    end

    @tweets = client.user_timeline(author, :count => 20)

    tweet_text = ""

    @tweets.each do |tweet|
      tweet_text += tweet.text
    end

    tweet_text = tweet_text.gsub(/http:\/\/[\w\.:\/]+/, '')
    tweet_text = tweet_text.gsub(/https:\/\/[\w\.:\/]+/, '')

    keywords = HTTParty.post(
            "http://api.cortical.io:80/rest/text/keywords?retina_name=en_synonymous",
            :headers => {
               "api-key" => "b15cf6d0-d2ed-11e5-8378-4dad29be0fab",
            },
            :body => tweet_text
    ).parsed_response;

    keywords = HTTParty.post(
            "http://api.cortical.io:80/rest/text/keywords?retina_name=en_synonymous",
            :headers => {
               "api-key" => "b15cf6d0-d2ed-11e5-8378-4dad29be0fab",
            },
            :body => tweet_text
    ).parsed_response;

    @keyword_hash = Hash[keywords.map {|x| [x, Array.new]}]

    seen_text = [];

    @tweets.each do |tweet|
      tweet_text = tweet.text.downcase
      if(seen_text.include?(tweet_text))
        return
      end
      seen_text << tweet_text  #no duplicates
      keywords.each do |keyword|
        if(tweet_text.include?(keyword))
          @keyword_hash[keyword] << tweet.id/10000
        end
      end
    end
  end

  def compare
    author1 = params[:user_1]
    author2 = params[:user_2]

    client = Twitter::REST::Client.new do |config|
      config.consumer_key = "fXcZzKOXmZjY4iE0ImeETmEXh"
      config.consumer_secret = "ADePCTpqAhJezCN0MpsIzKJVCecrgfTURGu079RVeJSHcJfLuB"
      config.access_token = "3031279493-GYA814kt8GaKESYF5PuMtxAW5vRJ3q6D6es714n"
      config.access_token_secret = "ediZdDzg72XidcZLHyEvcexpw7TsgBovkrjpuc4hqLT8X"
    end

    @tweets1 = client.user_timeline(author1, :count => 20)
    @tweets2 = client.user_timeline(author2, :count => 20)

    tweet_text1 = ""

    @tweets1.each do |tweet|
      tweet_text1 += tweet.text
    end

    tweet_text2 = ""

    @tweets2.each do |tweet|
      tweet_text2 += tweet.text
    end

    tweet_text1 = tweet_text1.gsub(/http:\/\/[\w\.:\/]+/, '')
    tweet_text2 = tweet_text2.gsub(/https:\/\/[\w\.:\/]+/, '')


    keywords = HTTParty.post(
            "http://api.cortical.io:80/rest/compare?retina_name=en_associative",
            :headers => {
               "api-key" => "b15cf6d0-d2ed-11e5-8378-4dad29be0fab",
            },
            :body => JSON.generate([tweet_text1, tweet_text2])
            ).parsed_response;



    @keyword_hash = Hash[keywords.map {|x| [x, Array.new]}]

    seen_text = [];

    @tweets.each do |tweet|
      tweet_text = tweet.text.downcase
      if(seen_text.include?(tweet_text))
        return
      end
      seen_text << tweet_text  #no duplicates
      keywords.each do |keyword|
        if(tweet_text.include?(keyword))
          @keyword_hash[keyword] << tweet.id/10000
        end
      end
    end
  end
end


# "Takeaway from #GOPdebate: We can't let one of these guys rip away the progress we've made. Sign on if you agree: https://t.co/EuV4hq7R1sRT @TheBriefing2016: Pretty great night to be a Democrat. #GOPDebate #tcot https://t.co/rw3KZRGgrRIf anyone needed a reminder of how important it is to elect a Democratic president, look at the Supreme Court.\nhttps://t.co/j4aT4FO1grDemonizing immigrants, dangerous foreign policy proposals, and nonstop bickering—no need to live-tweet #GOPdebate. We've seen enough.Necesitamos una presidenta que pueda defendernos de las propuestas de los republicanos. #GOPdebate"
