class Lecture < ApplicationRecord
    belongs_to :course
    validates :name, presence: true
    default_scope -> { order(created_at: :desc) }
    mount_uploader :pdf, PdfUploader
end
