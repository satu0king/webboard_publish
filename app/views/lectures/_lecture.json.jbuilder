json.extract! lecture, :id, :course_id, :name, :data, :created_at, :updated_at
json.url course_lectures_url(lecture, format: :json)
