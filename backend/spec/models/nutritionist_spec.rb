require 'rails_helper'

RSpec.describe Nutritionist, type: :model do
  it { is_expected.to have_many(:services) }
  it { is_expected.to have_many(:appointment_requests) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:email) }
end
