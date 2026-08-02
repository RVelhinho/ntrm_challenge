require 'rails_helper'

RSpec.describe AppointmentRequest, type: :model do
  subject(:appointment_request) { build(:appointment_request) }

  it { is_expected.to belong_to(:guest) }
  it { is_expected.to belong_to(:nutritionist) }
  it { is_expected.to belong_to(:service) }

  it "requires the end to be after the start" do
    appointment_request.ends_at = appointment_request.starts_at

    expect(appointment_request).not_to be_valid
    expect(appointment_request.errors[:ends_at]).to include("must be after starts_at")
  end
end
