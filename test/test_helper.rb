ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  # include Devise::TestHelpers
  def setup
    # @request.env["devise.mapping"] = Devise.mappings[:user]
    # sign_in users(:one)
  end

  # Add more helper methods to be used by all tests here...
end
