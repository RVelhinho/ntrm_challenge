require "rails_helper"

RSpec.describe AppointmentRequests::Create do
  let(:nutritionist) { create(:nutritionist) }
  let(:service) { create(:service, nutritionist: nutritionist, duration_minutes: 45) }
  let(:starts_at) { Time.zone.parse("2026-08-03 10:00") }

  it "calculates the end time and supersedes the guest's pending request" do
    guest = create(:guest, email: "guest@example.com")
    previous = create(:appointment_request, guest: guest, service: service, nutritionist: nutritionist)

    request = described_class.call(
      guest_name: "Updated Guest",
      guest_email: " GUEST@EXAMPLE.COM ",
      service: service,
      starts_at: starts_at
    )

    expect(previous.reload).to be_superseded
    expect(request).to be_pending
    expect(request.guest).to eq(guest)
    expect(request.ends_at).to eq(starts_at + 45.minutes)
  end

  it "rejects overlap with an accepted appointment but permits boundary adjacency" do
    create(:appointment_request, :accepted, nutritionist: nutritionist, service: service,
      starts_at: starts_at, ends_at: starts_at + 45.minutes)

    expect do
      described_class.call(guest_name: "Guest", guest_email: "one@example.com", service: service, starts_at: starts_at + 30.minutes)
    end.to raise_error(DomainError) { |error| expect(error.code).to eq("appointment_unavailable") }

    adjacent = described_class.call(
      guest_name: "Guest", guest_email: "two@example.com", service: service, starts_at: starts_at + 45.minutes
    )
    expect(adjacent).to be_pending
  end
end

RSpec.describe AppointmentRequests::Accept do
  include ActiveJob::TestHelper

  before { ActionMailer::Base.deliveries.clear }

  it "accepts the request and rejects overlapping pending requests" do
    nutritionist = create(:nutritionist)
    service = create(:service, nutritionist: nutritionist, duration_minutes: 60)
    accepted = create(:appointment_request, nutritionist: nutritionist, service: service, starts_at: Time.zone.parse("2026-08-03 10:00"), ends_at: Time.zone.parse("2026-08-03 11:00"))
    overlapping = create(:appointment_request, nutritionist: nutritionist, service: service, starts_at: Time.zone.parse("2026-08-03 10:30"), ends_at: Time.zone.parse("2026-08-03 11:30"))

    perform_enqueued_jobs { described_class.call(accepted.id) }

    expect(accepted.reload).to be_accepted
    expect(overlapping.reload).to be_rejected
    expect(ActionMailer::Base.deliveries.map(&:to).flatten).to contain_exactly(
      accepted.guest.email,
      overlapping.guest.email
    )
  end

  it "returns a domain conflict when an accepted appointment already overlaps" do
    nutritionist = create(:nutritionist)
    service = create(:service, nutritionist: nutritionist)
    accepted = create(:appointment_request, :accepted, nutritionist: nutritionist, service: service)
    pending = create(:appointment_request, nutritionist: nutritionist, service: service,
      starts_at: accepted.starts_at + 15.minutes, ends_at: accepted.ends_at + 15.minutes)

    expect { described_class.call(pending.id) }.to raise_error(DomainError) do |error|
      expect(error.code).to eq("appointment_unavailable")
    end
    expect(pending.reload).to be_pending
    expect(ActionMailer::Base.deliveries).to be_empty
  end
end

RSpec.describe AppointmentRequests::Reject do
  include ActiveJob::TestHelper

  before { ActionMailer::Base.deliveries.clear }

  it "rejects a pending request" do
    request = create(:appointment_request)

    perform_enqueued_jobs { described_class.call(request.id) }
    expect(request.reload).to be_rejected
    expect(request.answered_at).to be_present
    expect(ActionMailer::Base.deliveries.map(&:to).flatten).to eq([ request.guest.email ])
  end
end

RSpec.describe DateTimeParser do
  it "rejects blank and malformed values" do
    expect { described_class.call(nil) }.to raise_error(ArgumentError, "starts_at is required")
    expect { described_class.call("not-a-date") }.to raise_error(ArgumentError, "starts_at must be a valid datetime")
  end
end
