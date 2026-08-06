class AppointmentRequestsSearch
  def self.call(filters = {})
    new(filters).call
  end

  def initialize(filters)
    @filters = filters
  end

  def call
    scope = AppointmentRequest.includes(:guest, :service, :nutritionist)
    scope = apply_status(scope)
    scope = apply_search(scope)
    scope.order(Arel.sql("appointment_requests.created_at DESC, appointment_requests.id DESC"))
  end

  private

  def apply_status(scope)
    status = @filters[:status].presence || "pending"
    return scope if status == "all"
    raise DomainError.new("invalid_status", "status is invalid") unless AppointmentRequest.statuses.key?(status)

    scope.where(status: status)
  end

  def apply_search(scope)
    return scope if @filters[:q].blank?

    term = "%#{ActiveRecord::Base.sanitize_sql_like(@filters[:q].to_s.strip)}%"
    scope.joins(:guest, :service, :nutritionist).where(
      "guests.name ILIKE :term OR guests.email ILIKE :term OR services.name ILIKE :term OR nutritionists.name ILIKE :term",
      term: term
    )
  end
end
