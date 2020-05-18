class AddIndexToCoursesCourseName < ActiveRecord::Migration[5.2]
  def change
    add_index :courses, :name    
  end
end
