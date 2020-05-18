require 'test_helper'

class FollowControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  
  setup do
    @course = courses(:one)
    # user.confirm! # or set a confirmed_at inside the factory. Only necessary if you are using the "confirmable" module
    sign_in users(:one)
  end

  test "should get new" do
    get user_profile_url(users(:one))
    assert_response :success
  end

end
