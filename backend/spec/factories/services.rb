FactoryBot.define do
  factory :service do
    nutritionist
    sequence(:name) { |number| "Consultation #{number}" }
    price_cents { 5000 }
    duration_minutes { 60 }
    location { "Braga" }
    latitude { 41.5454 }
    longitude { -8.4265 }
  end
end
