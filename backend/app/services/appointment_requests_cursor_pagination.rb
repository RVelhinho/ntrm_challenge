require "base64"
require "json"
require "time"

class AppointmentRequestsCursorPagination
  DEFAULT_LIMIT = 20
  MAX_LIMIT = 100
  SORT = "created_at_desc"

  Page = Data.define(:records, :page_size, :has_next_page, :has_previous_page, :next_cursor)

  def self.call(scope:, cursor:, limit:, filters:)
    new(scope:, cursor:, limit:, filters:).call
  end

  def initialize(scope:, cursor:, limit:, filters:)
    @scope = scope
    @cursor_value = cursor.presence
    @cursor = decode_cursor(@cursor_value) if @cursor_value
    @limit = pagination_limit(limit)
    @filters = filters
  end

  def call
    validate_cursor! if @cursor

    page_scope = @scope
    if @cursor
      page_scope = page_scope.where(
        "(appointment_requests.created_at, appointment_requests.id) < (?, ?)",
        @cursor.fetch("created_at"),
        @cursor.fetch("id")
      )
    end

    fetched_records = page_scope.limit(@limit + 1).to_a
    has_next_page = fetched_records.length > @limit
    records = fetched_records.first(@limit)
    next_cursor = encode_cursor(records.last) if has_next_page && records.last

    Page.new(
      records:,
      page_size: @limit,
      has_next_page:,
      has_previous_page: @cursor_value.present?,
      next_cursor:
    )
  end

  private

  def pagination_limit(value)
    return DEFAULT_LIMIT if value.blank?

    Integer(value).clamp(1, MAX_LIMIT)
  rescue ArgumentError, TypeError
    DEFAULT_LIMIT
  end

  def encode_cursor(record)
    payload = {
      created_at: record.created_at.iso8601(6),
      id: record.id,
      filters: @filters,
      sort: SORT
    }
    Base64.urlsafe_encode64(JSON.generate(payload), padding: false)
  end

  def decode_cursor(value)
    raise_invalid_cursor unless value.match?(/\A[A-Za-z0-9_-]+\z/)

    padding = "=" * ((4 - value.length % 4) % 4)
    JSON.parse(Base64.urlsafe_decode64(value + padding))
  rescue ArgumentError, JSON::ParserError, TypeError
    raise_invalid_cursor
  end

  def validate_cursor!
    expected_keys = %w[created_at filters id sort]
    raise_invalid_cursor unless @cursor.is_a?(Hash) && @cursor.keys.sort == expected_keys
    raise_invalid_cursor unless @cursor["id"].is_a?(Integer) && @cursor["id"].positive?
    raise_invalid_cursor unless @cursor["filters"] == @filters
    raise_invalid_cursor unless @cursor["sort"] == SORT

    Time.iso8601(@cursor.fetch("created_at"))
  rescue KeyError, ArgumentError, TypeError
    raise_invalid_cursor
  end

  def raise_invalid_cursor
    raise DomainError.new("invalid_cursor", "cursor is invalid", status: :bad_request)
  end
end
