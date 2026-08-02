class DateTimeParser
  def self.call(value)
    raise ArgumentError, "starts_at is required" if value.blank?

    parsed = begin
      Time.zone.parse(value.to_s)
    rescue ArgumentError, Date::Error, TypeError
      nil
    end

    return parsed if parsed.present?

    raise ArgumentError, "starts_at must be a valid datetime"
  end
end
