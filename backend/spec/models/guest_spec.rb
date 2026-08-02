require 'rails_helper'

RSpec.describe Guest, type: :model do
  it { is_expected.to have_many(:appointment_requests) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:email) }

  it "normalizes email" do
    guest = build(:guest, email: "  PERSON@Example.COM ")

    guest.valid?

    expect(guest.email).to eq("person@example.com")
  end
end
