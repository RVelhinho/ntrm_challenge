require 'rails_helper'

RSpec.describe Service, type: :model do
  it { is_expected.to belong_to(:nutritionist) }
  it { is_expected.to have_many(:appointment_requests) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:location) }
  it { is_expected.to validate_numericality_of(:price_cents).is_greater_than_or_equal_to(0).only_integer }
  it { is_expected.to validate_numericality_of(:duration_minutes).is_greater_than(0).only_integer }
end
