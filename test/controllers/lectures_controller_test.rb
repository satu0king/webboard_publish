require 'test_helper'

class LecturesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @lecture = lectures(:one)
  end

  test "should get index" do
    get index_url
    assert_response :success
  end

  test "should get new" do
    get new_course_lecture_url(courses(:one))
    assert_response :success
  end


  test "should show lecture" do
    get course_lectures_url(@lecture)
    assert_response :success
  end

  test "should get edit" do
    get edit_course_url(@lecture, @lecture.course_id)
    assert_response :success
  end

  test "should update lecture" do
    patch course_lecture_url(@lecture.course_id, @lecture.id), params: { lecture: { course_id: @lecture.course_id, data: @lecture.data, name: @lecture.name } }
    assert_redirected_to course_lectures_url
  end

  test "should destroy lecture" do
    assert_difference('Lecture.count', -1) do
      delete course_lecture_url(@lecture, @lecture)
    end

    assert_redirected_to course_lectures_url
  end
end
