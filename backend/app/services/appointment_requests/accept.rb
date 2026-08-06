module AppointmentRequests
  class Accept
    def self.call(id)
      new(id).call
    end

    def initialize(id)
      @id = id
    end

    def call
      request = AppointmentRequest.find(@id)
      rejected_requests = []

      request.nutritionist.with_lock do
        request.lock!
        raise DomainError.new("invalid_status_transition", "only pending requests can be accepted", status: :conflict) unless request.pending?
        if AppointmentRequest.accepted.where(nutritionist_id: request.nutritionist_id)
            .where("starts_at < :ends_at AND ends_at > :starts_at", starts_at: request.starts_at, ends_at: request.ends_at).exists?
          raise DomainError.new("appointment_unavailable", "appointment overlaps an accepted appointment", status: :conflict)
        end

        rejected_requests = AppointmentRequest.pending
          .where(nutritionist_id: request.nutritionist_id)
          .where.not(id: request.id)
          .where("starts_at < :ends_at AND ends_at > :starts_at", starts_at: request.starts_at, ends_at: request.ends_at)
          .to_a

        AppointmentRequest.pending
          .where(id: rejected_requests.map(&:id))
          .update_all(status: AppointmentRequest.statuses[:rejected], answered_at: Time.current, updated_at: Time.current)

        request.update!(status: :accepted, answered_at: Time.current)
      end

      AppointmentRequestMailer.accepted(request).deliver_later
      rejected_requests.each { |rejected_request| AppointmentRequestMailer.rejected(rejected_request).deliver_later }

      request
    end
  end
end
