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

  it "requires the service to belong to the nutritionist" do
    appointment_request.nutritionist = create(:nutritionist)

    expect(appointment_request).not_to be_valid
    expect(appointment_request.errors[:service]).to include("must belong to nutritionist")
  end

  it "requires answered_at for decided requests" do
    appointment_request.status = :accepted
    appointment_request.answered_at = nil

    expect(appointment_request).not_to be_valid
    expect(appointment_request.errors[:answered_at]).to include("must be present when answered")
  end

  it "enforces non-overlapping accepted appointments in the database" do
    accepted = create(:appointment_request, :accepted)

    expect do
      AppointmentRequest.transaction(requires_new: true) do
        create(:appointment_request, :accepted, nutritionist: accepted.nutritionist, service: accepted.service,
          starts_at: accepted.starts_at + 15.minutes, ends_at: accepted.ends_at + 15.minutes)
      end
    end.to raise_error(ActiveRecord::ExclusionViolation)

    adjacent = create(:appointment_request, :accepted, nutritionist: accepted.nutritionist, service: accepted.service,
      starts_at: accepted.ends_at, ends_at: accepted.ends_at + 1.hour)
    expect(adjacent).to be_persisted
  end
end
