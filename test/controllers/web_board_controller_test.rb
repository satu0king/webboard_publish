require 'test_helper'

class WebBoardControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  
  setup do
    @course = courses(:one)
    # user.confirm! # or set a confirmed_at inside the factory. Only necessary if you are using the "confirmable" module
    sign_in users(:one)
  end

  test "should get write" do
    get board_url(lectures(:one))
    assert_response :success
  end

  test "should get save" do
    get save_board_url
    assert_response :success
  end

  test "should get new" do
    get launch_board_url
    assert_response :success
  end

end
