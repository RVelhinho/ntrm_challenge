class OffsetPagination
  DEFAULT_PAGE = 1
  DEFAULT_LIMIT = 20
  MAX_LIMIT = 100

  Page = Data.define(:records, :current_page, :page_size, :total_count, :total_pages, :has_next_page, :has_previous_page)

  def self.call(scope:, page:, limit:)
    new(scope:, page:, limit:).call
  end

  def initialize(scope:, page:, limit:)
    @scope = scope
    @page = pagination_page(page)
    @limit = pagination_limit(limit)
  end

  def call
    total_count = @scope.count
    total_pages = total_count.zero? ? 0 : (total_count.to_f / @limit).ceil
    offset = (@page - 1) * @limit
    records = @scope.limit(@limit).offset(offset).to_a

    Page.new(
      records:,
      current_page: @page,
      page_size: @limit,
      total_count:,
      total_pages:,
      has_next_page: total_pages.positive? && @page < total_pages,
      has_previous_page: @page > 1
    )
  end

  private

  def pagination_page(value)
    return DEFAULT_PAGE if value.blank?

    Integer(value).clamp(1, Float::INFINITY)
  rescue ArgumentError, TypeError
    DEFAULT_PAGE
  end

  def pagination_limit(value)
    return DEFAULT_LIMIT if value.blank?

    Integer(value).clamp(1, MAX_LIMIT)
  rescue ArgumentError, TypeError
    DEFAULT_LIMIT
  end
end
