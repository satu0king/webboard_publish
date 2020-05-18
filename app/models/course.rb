class Course < ApplicationRecord
    belongs_to :user
    has_many :lectures, dependent: :destroy
    has_many :follows
    validates :name, presence: true
    default_scope -> { order(created_at: :desc) }
    validates :description, length: {maximum: 140}
end
