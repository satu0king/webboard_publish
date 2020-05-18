class CreateLectures < ActiveRecord::Migration[5.2]
  def change
    create_table :lectures do |t|
      t.integer :course_id
      t.string :name
      t.json :data

      t.timestamps
    end
  end
end
