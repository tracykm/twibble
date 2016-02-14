Rails.application.routes.draw do
  resources :tweets
  namespace :api, defaults: {format: :json} do
    resources :authors, only: [:show]
  end
end
