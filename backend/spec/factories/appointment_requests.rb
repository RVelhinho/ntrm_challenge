FactoryBot.define do
  factory :appointment_request do
    guest
    service
    nutritionist { service.nutritionist }
    starts_at { 1.day.from_now.change(sec: 0) }
    ends_at { starts_at + service.duration_minutes.minutes }
    status { :pending }
    answered_at { %w[accepted rejected].include?(status.to_s) ? Time.current : nil }

    trait :accepted do
      status { :accepted }
    end

    trait :rejected do
      status { :rejected }
    end
  end
end
