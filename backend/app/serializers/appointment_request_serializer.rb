class AppointmentRequestSerializer
  def self.call(request)
    {
      id: request.id,
      guest: {
        id: request.guest.id,
        name: request.guest.name,
        email: request.guest.email
      },
      nutritionist_id: request.nutritionist_id,
      service: {
        id: request.service.id,
        name: request.service.name
      },
      starts_at: request.starts_at,
      ends_at: request.ends_at,
      status: request.status,
      answered_at: request.answered_at
    }
  end
end
