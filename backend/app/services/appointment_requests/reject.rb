module AppointmentRequests
  class Reject
    def self.call(id)
      new(id).call
    end

    def initialize(id)
      @id = id
    end

    def call
      request = AppointmentRequest.find(@id)

      request.with_lock do
        raise ArgumentError, "only pending requests can be rejected" unless request.pending?

        request.update!(status: :rejected, answered_at: Time.current)
      end

      AppointmentRequestMailer.rejected(request).deliver_later
      request
    end
  end
end
