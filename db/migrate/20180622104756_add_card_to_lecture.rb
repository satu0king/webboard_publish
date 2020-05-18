class AddCardToLecture < ActiveRecord::Migration[5.2]
  def change
    add_column :lectures, :card, :string
  end
end
