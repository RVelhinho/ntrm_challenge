class Service < ApplicationRecord
  has_many :appointment_requests
  belongs_to :nutritionist

  validates :name, :location, presence: true
  validates :price_cents, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :duration_minutes, numericality: { only_integer: true, greater_than: 0 }
end
