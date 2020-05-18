class AddFieldsToCourses < ActiveRecord::Migration[5.2]
  def change
    add_column :courses, :up_count, :integer
    add_column :courses, :down_count, :integer
  end
end
