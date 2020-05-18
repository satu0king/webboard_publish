require 'rails_helper'

RSpec.describe "Courses", type: :request do
  describe "GET /index" do
    it "works! " do
      get index_path
      expect(response).to have_http_status(200)
    end
  end
end
