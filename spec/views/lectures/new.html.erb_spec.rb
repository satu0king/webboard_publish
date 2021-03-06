require 'rails_helper'

RSpec.describe "lectures/new", type: :view do
  before(:each) do
    assign(:lecture, Lecture.new())
  end

  it "renders new lecture form" do
    render

    assert_select "form[action=?][method=?]", lectures_path, "post" do
    end
  end
end
