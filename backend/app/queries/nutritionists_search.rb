class NutritionistsSearch
  Result = Data.define(:nutritionists, :location, :location_mode, :distance_by_id)

  def self.call(filters = {})
    new(filters).call
  end

  def initialize(filters)
    @filters = filters
  end

  def call
    query = Nutritionist.includes(:services)
    search = @filters[:q].presence || @filters[:name].presence || @filters[:service].presence
    origin = coordinates_from_params
    location = resolved_location(origin)

    if search
      term = "%#{sanitize(search)}%"
      query = query.joins(:services).where(
        "nutritionists.name ILIKE :term OR services.name ILIKE :term",
        term: term
      )
    end

    if origin
      query = query.joins(:services).where.not(services: { latitude: nil, longitude: nil })
    else
      query = query.joins(:services) unless search
      query = query.where("services.location ILIKE :location", location: "%#{sanitize(location)}%")
    end

    nutritionists = query.distinct.to_a
    distances = nutritionists.to_h { |nutritionist| [ nutritionist.id, distance_from(origin, nutritionist) ] }

    ordered = nutritionists.sort_by do |nutritionist|
      [ distances[nutritionist.id] || Float::INFINITY, nutritionist.name ]
    end

    Result.new(
      nutritionists: ordered,
      location: location,
      location_mode: origin ? "nearest" : (location ? "exact" : "all"),
      distance_by_id: distances
    )
  end

  private

  def sanitize(value)
    ActiveRecord::Base.sanitize_sql_like(value.to_s.strip)
  end

  def resolved_location(origin)
    return nearest_location(origin) if origin

    requested = @filters[:location].presence.to_s.strip
    return "Braga" if requested.blank?

    matching_location = Service.where("lower(location) = ?", requested.downcase).pick(:location)
    matching_location.presence || "Braga"
  end

  def coordinates_from_params
    latitude = Float(@filters[:latitude], exception: false)
    longitude = Float(@filters[:longitude], exception: false)
    return if latitude.nil? || longitude.nil?
    return unless latitude.between?(-90, 90) && longitude.between?(-180, 180)

    [ latitude, longitude ]
  end

  def nearest_location(origin)
    Service.where.not(latitude: nil, longitude: nil).find_each.min_by do |service|
      haversine_distance(origin, [ service.latitude.to_f, service.longitude.to_f ])
    end&.location
  end

  # The locations stored by services act as the application's geocoding source.
  def distance_from(origin, nutritionist)
    return unless origin

    nutritionist.services.filter_map do |service|
      next unless service.latitude && service.longitude

      haversine_distance(origin, [ service.latitude.to_f, service.longitude.to_f ])
    end.min || Float::INFINITY
  end

  def haversine_distance(origin, destination)
    latitude_delta = radians(destination[0] - origin[0])
    longitude_delta = radians(destination[1] - origin[1])
    latitude_origin = radians(origin[0])
    latitude_destination = radians(destination[0])
    a = Math.sin(latitude_delta / 2)**2 + Math.cos(latitude_origin) * Math.cos(latitude_destination) * Math.sin(longitude_delta / 2)**2

    6_371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  end

  def radians(degrees)
    degrees * Math::PI / 180
  end
end
