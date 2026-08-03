FactoryBot.define do
  factory :nutritionist do
    sequence(:name) { |number| "Nutritionist #{number}" }
    sequence(:email) { |number| "nutritionist#{number}@example.com" }
    biography { "Nutrition guidance" }
    gender { "female" }
  end
end
