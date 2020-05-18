class AddPdfLinkInLecture < ActiveRecord::Migration[5.2]
  def change
    add_column :lectures, :pdf, :string
  end
end
