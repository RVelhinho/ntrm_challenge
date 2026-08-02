FactoryBot.define do
  factory :appointment_request do
    guest
    service
    nutritionist { service.nutritionist }
    starts_at { 1.day.from_now.change(sec: 0) }
    ends_at { starts_at + service.duration_minutes.minutes }
    status { :pending }
    answered_at { nil }
  end
end
