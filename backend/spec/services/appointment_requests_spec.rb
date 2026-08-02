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
end

RSpec.describe AppointmentRequests::Accept do
  it "accepts the request and rejects overlapping pending requests" do
    nutritionist = create(:nutritionist)
    service = create(:service, nutritionist: nutritionist, duration_minutes: 60)
    accepted = create(:appointment_request, nutritionist: nutritionist, service: service, starts_at: Time.zone.parse("2026-08-03 10:00"), ends_at: Time.zone.parse("2026-08-03 11:00"))
    overlapping = create(:appointment_request, nutritionist: nutritionist, service: service, starts_at: Time.zone.parse("2026-08-03 10:30"), ends_at: Time.zone.parse("2026-08-03 11:30"))

    expect { described_class.call(accepted.id) }.to have_enqueued_mail(AppointmentRequestMailer, :accepted)

    expect(accepted.reload).to be_accepted
    expect(overlapping.reload).to be_rejected
  end
end

RSpec.describe AppointmentRequests::Reject do
  it "rejects a pending request and enqueues a notification" do
    request = create(:appointment_request)

    expect { described_class.call(request.id) }.to have_enqueued_mail(AppointmentRequestMailer, :rejected)
    expect(request.reload).to be_rejected
    expect(request.answered_at).to be_present
  end
end

RSpec.describe DateTimeParser do
  it "rejects blank and malformed values" do
    expect { described_class.call(nil) }.to raise_error(ArgumentError, "starts_at is required")
    expect { described_class.call("not-a-date") }.to raise_error(ArgumentError, "starts_at must be a valid datetime")
  end
end
