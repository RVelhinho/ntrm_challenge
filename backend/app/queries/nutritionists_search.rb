class NutritionistsSearch
  DEFAULT_LOCATION = "Braga".freeze
  Result = Data.define(:nutritionists, :location, :locations)

  def self.call(filters = {})
    new(filters).call
  end

  def initialize(filters)
    @filters = filters
  end

  def call
    query = Nutritionist.includes(:services)
    search = @filters[:q].presence || @filters[:name].presence || @filters[:service].presence
    locations = available_locations
    location = resolved_location(locations)

    if search
      term = "%#{sanitize(search)}%"
      matching_services = Service.where("services.name ILIKE :term", term: term).select(:nutritionist_id)
      query = query.where("nutritionists.name ILIKE :term OR nutritionists.id IN (:service_ids)", term: term, service_ids: matching_services)
    end

    matching_locations = Service.where("lower(location) = ?", location.downcase).select(:nutritionist_id)
    query = query.where(id: matching_locations)

    Result.new(
      nutritionists: query.order(Arel.sql("lower(nutritionists.name)"), :id),
      location: location,
      locations: locations
    )
  end

  private

  def sanitize(value)
    ActiveRecord::Base.sanitize_sql_like(value.to_s.strip)
  end

  def resolved_location(locations)
    requested = @filters[:location].presence.to_s.strip
    return DEFAULT_LOCATION if requested.blank?

    matching_location = locations.find { |location| location.casecmp?(requested) }
    matching_location.presence || DEFAULT_LOCATION
  end

  def available_locations
    Service
      .select("DISTINCT ON (lower(location)) location")
      .order(Arel.sql("lower(location), location"))
      .map(&:location)
  end
end
