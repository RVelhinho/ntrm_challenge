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
  validate :service_belongs_to_nutritionist
  validate :answered_at_matches_status

  private

  def ends_after_start
    return if starts_at.blank? || ends_at.blank? || ends_at > starts_at

    errors.add(:ends_at, "must be after starts_at")
  end

  def service_belongs_to_nutritionist
    return if service.blank? || nutritionist.blank? || service.nutritionist_id == nutritionist_id

    errors.add(:service, "must belong to nutritionist")
  end

  def answered_at_matches_status
    if (accepted? || rejected?) && answered_at.blank?
      errors.add(:answered_at, "must be present when answered")
    elsif (pending? || superseded?) && answered_at.present?
      errors.add(:answered_at, "must be blank when unanswered")
    end
  end
end
