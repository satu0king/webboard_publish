require 'rails_helper'

RSpec.describe "lectures/edit", type: :view do
  before(:each) do
    @lecture = assign(:lecture, Lecture.create!())
  end

  it "renders the edit lecture form" do
    render

    assert_select "form[action=?][method=?]", lecture_path(@lecture), "post" do
    end
  end
end
