class AppointmentRequest < ApplicationRecord
  belongs_to :guest
  belongs_to :nutritionist
  belongs_to :service

  enum :status, {
    pending: 0,
    accepted: 1,
    rejected: 2,
    superseded: 3
  }

  validates :starts_at, :ends_at, presence: true
  validate :ends_after_start

  private

  def ends_after_start
    return if starts_at.blank? || ends_at.blank? || ends_at > starts_at

    errors.add(:ends_at, "must be after starts_at")
  end
end
