class Guest < ApplicationRecord
  has_many :appointment_requests
  before_validation :normalize_email

  validates :name, :email, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: { case_sensitive: false }

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
