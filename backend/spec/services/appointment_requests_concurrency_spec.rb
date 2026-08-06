require "rails_helper"

RSpec.describe "Appointment request concurrency" do
  self.use_transactional_tests = false

  after do
    next unless @nutritionist

    requests = AppointmentRequest.where(nutritionist_id: @nutritionist.id)
    guest_ids = requests.pluck(:guest_id)
    requests.delete_all
    Service.where(nutritionist_id: @nutritionist.id).delete_all
    Guest.where(id: guest_ids).delete_all
    Nutritionist.where(id: @nutritionist.id).delete_all
  end

  it "keeps one guest and one pending request for concurrent creation" do
    @nutritionist = create(:nutritionist)
    service = create(:service, nutritionist: @nutritionist)
    starts_at = Time.zone.parse("2026-08-03 10:00")

    results = run_concurrently(2) do
      AppointmentRequests::Create.call(
        guest_name: "Concurrent Guest",
        guest_email: " CONCURRENT@EXAMPLE.COM ",
        service: service,
        starts_at: starts_at
      )
    end

    expect(results).to all(be_a(AppointmentRequest))
    guest = Guest.find_by!(email: "concurrent@example.com")
    expect(Guest.where(email: "concurrent@example.com").count).to eq(1)
    expect(guest.appointment_requests.pending.count).to eq(1)
    expect(guest.appointment_requests.superseded.count).to eq(1)
  end

  it "accepts only one of two overlapping requests concurrently" do
    @nutritionist = create(:nutritionist)
    service = create(:service, nutritionist: @nutritionist)
    starts_at = Time.zone.parse("2026-08-03 10:00")
    requests = 2.times.map do |index|
      create(:appointment_request,
        guest: create(:guest),
        nutritionist: @nutritionist,
        service: service,
        starts_at: starts_at + index.minutes,
        ends_at: starts_at + 1.hour + index.minutes)
    end

    results = run_concurrently(2) { |index| AppointmentRequests::Accept.call(requests[index].id) }

    expect(results.count { |result| result.is_a?(AppointmentRequest) }).to eq(1)
    expect(results.count { |result| result.is_a?(DomainError) }).to eq(1)
    expect(requests.map { |request| request.reload.status }).to contain_exactly("accepted", "rejected")
  end

  def run_concurrently(count)
    ready = Queue.new
    start = Queue.new
    results = Queue.new
    threads = count.times.map do |index|
      Thread.new do
        ActiveRecord::Base.connection_pool.with_connection do
          ready << true
          start.pop
          results << yield(index)
        rescue StandardError => error
          results << error
        end
      end
    end

    count.times { ready.pop }
    count.times { start << true }
    threads.each(&:join)
    count.times.map { results.pop }
  end
end
