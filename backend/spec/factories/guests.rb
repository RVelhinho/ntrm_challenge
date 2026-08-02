FactoryBot.define do
  factory :guest do
    sequence(:name) { |number| "Guest #{number}" }
    sequence(:email) { |number| "guest#{number}@example.com" }
  end
end
