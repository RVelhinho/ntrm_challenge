class NutritionistSerializer
  def self.call(nutritionist, distance_km: nil)
    {
      id: nutritionist.id,
      name: nutritionist.name,
      biography: nutritionist.biography,
      distance_km: distance_km,
      services: nutritionist.services.map do |service|
        {
          id: service.id,
          name: service.name,
          price_cents: service.price_cents,
          duration_minutes: service.duration_minutes,
          location: service.location,
           latitude: service.latitude&.to_f,
           longitude: service.longitude&.to_f
        }
      end
    }
  end
end
