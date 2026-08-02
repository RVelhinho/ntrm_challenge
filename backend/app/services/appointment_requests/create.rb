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
      guest = find_or_create_guest

      guest.with_lock do
        guest.appointment_requests.pending.update_all(
          status: AppointmentRequest.statuses[:superseded],
          updated_at: Time.current
        )

        guest.appointment_requests.create!(
          nutritionist: @service.nutritionist,
          service: @service,
          starts_at: @starts_at,
          ends_at: @starts_at + @service.duration_minutes.minutes,
          status: :pending
        )
      end
    end

    private

    def find_or_create_guest
      email = @guest_email.to_s.strip.downcase
      raise ArgumentError, "guest_email is required" if email.blank?
      raise ArgumentError, "guest_name is required" if @guest_name.blank?

      guest = Guest.find_or_initialize_by(email: email)
      guest.update!(name: @guest_name)
      guest
    end
  end
end
