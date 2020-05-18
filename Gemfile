source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.0'
# Use sqlite3 as the database for Active Record
gem 'sqlite3'
# Use Puma as the app server
gem 'puma', '~> 3.12'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

gem 'pg', '0.20'

gem 'logstasher'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]

  gem 'rack-test'
  gem 'ci_reporter'
  gem 'ci_reporter_rspec'
  gem 'rspec_junit_formatter'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end


group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15', '< 4.0'
  gem 'selenium-webdriver'
  # Easy installation and use of chromedriver to run system tests with Chrome
  gem 'chromedriver-helper'

  gem 'rspec-rails', '~> 3.8'
  # gem "rspec_junit_formatter"
  
  # gem 'selenium-webdriver'
  # gem 'webdrivers', '~> 4.0'
  # gem 'capybara', '~> 2.13'
  # gem 'shoulda-matchers'
  

end

group :production do
  
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'devise'
gem 'bulma-rails', '~> 0.0.4.1'
# gem 'ims-lti'
gem 'oauth'
gem 'oauth-plugin'
# gem 'bootstrap', '~> 4.0.0.alpha6'
# gem 'bootstrap-sass', :git => 'https://github.com/twbs/bootstrap-sass.git', :branch => 'next'
gem 'will_paginate'
# gem 'bootstrap-will_paginate'
# gem 'searchlogic'
gem 'flexbox-rails'
gem 'ruby-lzma', '~> 0.4.3'
# gem 'sleek', path: '/home/nithinr07/Documents/Extra/Zense/sleek'
gem 'rails-erd'
gem 'kaminari'
gem 'rails_admin'
gem 'ims-lti', '~> 1.1.8'
gem 'carrierwave', '>= 2.0.0.rc', '< 3.0'