require 'test_helper'

class UserControllerTest < ActionDispatch::IntegrationTest

  include Devise::Test::IntegrationHelpers
  
  setup do
    sign_in users(:one)
  end

  test "should get profile" do
    get user_profile_url(users(:one))
    assert_response :success
  end

  test "should get course" do
    get user_course_url(users(:one))
    assert_response :success
  end

end
