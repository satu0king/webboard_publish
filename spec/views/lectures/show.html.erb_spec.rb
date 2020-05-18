require 'rails_helper'

RSpec.describe "lectures/show", type: :view do
  before(:each) do
    @lecture = assign(:lecture, Lecture.create!())
  end

  it "renders attributes in <p>" do
    render
  end
end
