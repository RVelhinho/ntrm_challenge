FactoryBot.define do
  factory :service do
    nutritionist
    sequence(:name) { |number| "Consultation #{number}" }
    price_cents { 5000 }
    duration_minutes { 60 }
    location { "Braga" }
  end
end
