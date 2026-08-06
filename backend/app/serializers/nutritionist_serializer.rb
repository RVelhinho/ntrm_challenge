class NutritionistSerializer
  def self.call(nutritionist)
    {
      id: nutritionist.id,
      name: nutritionist.name,
      biography: nutritionist.biography,
      gender: nutritionist.gender,
      services: nutritionist.services.map do |service|
        {
          id: service.id,
          name: service.name,
          price_cents: service.price_cents,
          duration_minutes: service.duration_minutes,
          location: service.location
        }
      end
    }
  end
end
