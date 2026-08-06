module AppointmentRequests
  class Create
    def self.call(guest_name:, guest_email:, service:, starts_at:)
      new(guest_name:, guest_email:, service:, starts_at:).call
    end

    def initialize(guest_name:, guest_email:, service:, starts_at:)
      @guest_name = guest_name
      @guest_email = guest_email
      @service = service
      @starts_at = starts_at
    end

    def call
      AppointmentRequest.transaction do
        nutritionist = @service.nutritionist

        nutritionist.with_lock do
          @service.reload
          ends_at = @starts_at + @service.duration_minutes.minutes
          ensure_available!(nutritionist, ends_at)
          guest = find_or_create_guest

          guest.with_lock do
            guest.update!(name: @guest_name)
            guest.appointment_requests.pending.update_all(
              status: AppointmentRequest.statuses[:superseded],
              updated_at: Time.current
            )

            guest.appointment_requests.create!(
              nutritionist: nutritionist,
              service: @service,
              starts_at: @starts_at,
              ends_at: ends_at,
              status: :pending
            )
          end
        end
      end
    end

    private

    def find_or_create_guest
      email = @guest_email.to_s.strip.downcase
      raise ArgumentError, "guest_email is required" if email.blank?
      raise ArgumentError, "guest_name is required" if @guest_name.blank?

      Guest.find_by(email: email) || create_guest(email)
    end

    def create_guest(email)
      Guest.transaction(requires_new: true) do
        Guest.create!(email: email, name: @guest_name)
      end
    rescue ActiveRecord::RecordNotUnique
      Guest.find_by!(email: email)
    end

    def ensure_available!(nutritionist, ends_at)
      overlap = nutritionist.appointment_requests.accepted.where(
        "starts_at < :ends_at AND ends_at > :starts_at",
        starts_at: @starts_at,
        ends_at: ends_at
      ).exists?
      return unless overlap

      raise DomainError.new("appointment_unavailable", "appointment overlaps an accepted appointment", status: :conflict)
    end
  end
end
