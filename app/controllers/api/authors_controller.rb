require 'httparty'



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


    # curl --data @order_new.json \
    #      -H "X-Augury-Token:My_token_goes_here" \
    #      -H "Content-Type:application/json" \
    #      http://staging.hub.spreecommerce.com/api/stores/store_id_goes_here/messages
    #
    # curl -X GET -H "api-key: b15cf6d0-d2ed-11e5-8378-4dad29be0fab" "http://api.cortical.io/rest/retinas"
    #

    # fail
    keywords = HTTParty.post(
            "http://api.cortical.io:80/rest/text/keywords?retina_name=en_synonymous",
            :headers => {
               "api-key" => "b15cf6d0-d2ed-11e5-8378-4dad29be0fab",
            },
            :body => tweet_text
    ).parsed_response;

    @keyword_hash = Hash[keywords.map {|x| [x, Array.new]}]

    @tweets.each do |tweet|
      tweet.text.split(" ").each do |word|
        word = word.downcase
        if @keyword_hash[word]
          # had trouble with JS rounding this number
          # also in view, should consolidate
          @keyword_hash[word] << tweet.id/10000
        end
      end
    end

    # result = HTTParty.get(
    #         "http://api.cortical.io/rest/retinas",
    #         :headers => {
    #            "api-key" => "b15cf6d0-d2ed-11e5-8378-4dad29be0fab",
    #         }
    # );

    # client = Cortical::REST::Client.new do |config|
    #   config.api-key: "b15cf6d0-d2ed-11e5-8378-4dad29be0fab"
    # end

  end
end


# "Takeaway from #GOPdebate: We can't let one of these guys rip away the progress we've made. Sign on if you agree: https://t.co/EuV4hq7R1sRT @TheBriefing2016: Pretty great night to be a Democrat. #GOPDebate #tcot https://t.co/rw3KZRGgrRIf anyone needed a reminder of how important it is to elect a Democratic president, look at the Supreme Court.\nhttps://t.co/j4aT4FO1grDemonizing immigrants, dangerous foreign policy proposals, and nonstop bickering—no need to live-tweet #GOPdebate. We've seen enough.Necesitamos una presidenta que pueda defendernos de las propuestas de los republicanos. #GOPdebate"
