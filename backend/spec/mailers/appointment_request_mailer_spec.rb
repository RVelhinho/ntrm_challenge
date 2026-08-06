require "rails_helper"

RSpec.describe AppointmentRequestMailer, type: :mailer do
  let(:request) { create(:appointment_request) }

  describe "accepted" do
    subject(:mail) { described_class.accepted(request) }

    it "addresses the guest and includes the appointment details" do
      expect(mail.to).to eq([ request.guest.email ])
      expect(mail.subject).to eq("Your appointment request was accepted")
      expect(mail.body.encoded).to include(request.guest.name, request.nutritionist.name, request.service.name)
    end
  end

  describe "rejected" do
    subject(:mail) { described_class.rejected(request) }

    it "addresses the guest and includes the rejection" do
      expect(mail.to).to eq([ request.guest.email ])
      expect(mail.subject).to eq("Your appointment request was rejected")
      expect(mail.body.encoded).to include(request.guest.name, "was rejected")
    end
  end
end
