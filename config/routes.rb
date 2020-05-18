Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users, :controllers => { registrations: 'registrations' }
  resources :courses, :except => [:index, :show] do
    resources :lectures, :except => [:show]
  end
  get '/board/:id/view', to: 'web_board#view', as: :board_view
  get '/board/:id', to: 'web_board#write', as: :board
  post '/board/:id', to: 'web_board#save'
  post '/board/:id/card', to: 'web_board#save_image'
  post '/board/:id/pdf', to: 'web_board#pdf_upload'
  post '/board/:id/:page_id', to: 'web_board#page_save'
  get '/board', to: 'web_board#new', as: :launch_board
  post '/save', to: 'web_board#savehang'
  get '/save_as', to: 'web_board#new_create', as: :save_board
  post '/save_as', to: 'web_board#create'  
  root 'static_pages#home'
  get '/home', to: 'static_pages#home'
  get '/help', to: 'static_pages#help'
  get '/about', to: 'static_pages#about'
  get '/features', to: 'static_pages#features'
  get '/index', to: 'courses#index'
  post '/index', to: 'courses#index'  
  get '/users/:id/profile', to: 'users#profile', as: :user_profile
  get '/users/:id/courses', to: 'users#course', as: :user_course
  get '/users/:id/follow', to: 'follow#all', as: :user_follow
  post '/user/:id/follow', to: 'follow#new', as: :user_new_follow
  delete 'user/:id/unfollow', to: 'follow#destroy', as: :user_unfollow

  get '/search', to: 'lectures#search'

  post '/upvote', to: 'courses#increment', as: :inc
  get '/downvote', to: 'courses#decrement', as: :dec

  # LTI XML CONFIG
  get :lti_config, controller: :launch, as: :lti_config

  # LTI LAUNCH URL (responds to get and post)
  match 'launch' => 'launch#launch', via: [:get, :post], as: :lti_launch
  


  # post '/save', to: 'web_board#save'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
