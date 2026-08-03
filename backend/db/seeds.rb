nutritionists = [
  {
    name: "Dr. Ana Silva",
    email: "ana.silva@example.com",
    gender: "female",
    biography: "Evidence-based nutrition plans for sustainable health.",
    services: [
      { name: "Initial nutrition consultation", price_cents: 5500, duration_minutes: 60, location: "Braga", latitude: 41.5454, longitude: -8.4265 },
      { name: "Follow-up consultation", price_cents: 3500, duration_minutes: 30, location: "Braga", latitude: 41.5454, longitude: -8.4265 },
      { name: "Online nutrition coaching", price_cents: 4000, duration_minutes: 45, location: "Guimaraes", latitude: 41.4425, longitude: -8.2918 }
    ]
  },
  {
    name: "Dr. Miguel Costa",
    email: "miguel.costa@example.com",
    gender: "male",
    biography: "Personalized sports and performance nutrition.",
    services: [
      { name: "Sports nutrition consultation", price_cents: 6500, duration_minutes: 60, location: "Porto", latitude: 41.1579, longitude: -8.6291 },
      { name: "Performance meal planning", price_cents: 8000, duration_minutes: 90, location: "Porto", latitude: 41.1579, longitude: -8.6291 }
    ]
  },
  {
    name: "Dr. Sofia Martins",
    email: "sofia.martins@example.com",
    gender: "female",
    biography: "Family nutrition and practical healthy eating support.",
    services: [
      { name: "Family nutrition assessment", price_cents: 6000, duration_minutes: 60, location: "Braga", latitude: 41.5454, longitude: -8.4265 },
      { name: "Healthy weight consultation", price_cents: 4500, duration_minutes: 45, location: "Barcelos", latitude: 41.5323, longitude: -8.6177 }
    ]
  },
  {
    name: "Dr. Rui Fernandes",
    email: "rui.fernandes@example.com",
    gender: "male",
    biography: "Digestive health guidance grounded in everyday routines.",
    services: [
      { name: "Digestive health consultation", price_cents: 7000, duration_minutes: 60, location: "Vila Nova de Famalicao", latitude: 41.4079, longitude: -8.5198 },
      { name: "Food intolerance review", price_cents: 5000, duration_minutes: 45, location: "Braga", latitude: 41.5454, longitude: -8.4265 }
    ]
  },
  {
    name: "Dr. Beatriz Almeida",
    email: "beatriz.almeida@example.com",
    gender: "female",
    biography: "Plant-based nutrition and sustainable lifestyle coaching.",
    services: [
      { name: "Plant-based nutrition plan", price_cents: 7500, duration_minutes: 75, location: "Aveiro", latitude: 40.6405, longitude: -8.6538 },
      { name: "Sustainable eating consultation", price_cents: 5000, duration_minutes: 45, location: "Coimbra", latitude: 40.2033, longitude: -8.4103 }
    ]
  }
]

nutritionists.each do |attributes|
  service_attributes = attributes.delete(:services)
  nutritionist = Nutritionist.find_or_initialize_by(email: attributes[:email])
  nutritionist.update!(attributes)

  service_attributes.each do |service_attributes|
    service = nutritionist.services.find_or_initialize_by(name: service_attributes[:name])
    service.update!(service_attributes)
  end
end
