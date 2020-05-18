require 'rails_helper'

RSpec.describe "lectures/index", type: :view do
  before(:each) do
    assign(:lectures, [
      Lecture.create!(),
      Lecture.create!()
    ])
  end

  it "renders a list of lectures" do
    render
  end
end
