module AppointmentRequests
  class Accept
    def self.call(id)
      new(id).call
    end

    def initialize(id)
      @id = id
    end

    def call
      rejected_requests = []
      request = AppointmentRequest.find(@id)

      request.nutritionist.with_lock do
        request.lock!
        raise ArgumentError, "only pending requests can be accepted" unless request.pending?

        rejected_requests = AppointmentRequest.pending
          .where(nutritionist_id: request.nutritionist_id)
          .where.not(id: request.id)
          .where("starts_at < :ends_at AND ends_at > :starts_at", starts_at: request.starts_at, ends_at: request.ends_at)
          .to_a

        rejected_requests.each do |overlap|
          overlap.update!(status: :rejected, answered_at: Time.current)
        end

        request.update!(status: :accepted, answered_at: Time.current)
      end

      rejected_requests.each { |overlap| AppointmentRequestMailer.rejected(overlap).deliver_later }
      AppointmentRequestMailer.accepted(request).deliver_later
      request
    end
  end
end
