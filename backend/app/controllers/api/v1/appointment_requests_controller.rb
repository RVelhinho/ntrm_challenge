class Api::V1::AppointmentRequestsController < ApplicationController
  def index
    filters = normalized_index_filters
    page = AppointmentRequestsCursorPagination.call(
      scope: AppointmentRequestsSearch.call(filters),
      cursor: params[:cursor],
      limit: params[:limit],
      filters: filters.stringify_keys
    )

    render json: {
      data: page.records.map { |request| AppointmentRequestSerializer.call(request) },
      page_info: {
        page_size: page.page_size,
        has_next_page: page.has_next_page,
        has_previous_page: page.has_previous_page,
        next_cursor: page.next_cursor
      }
    }
  end

  def create
    attributes = appointment_params
    %i[guest_name guest_email service_id starts_at].each { |key| attributes.require(key) }
    service = Service.find(attributes[:service_id])
    request = AppointmentRequests::Create.call(
      guest_name: attributes[:guest_name],
      guest_email: attributes[:guest_email],
      service: service,
      starts_at: DateTimeParser.call(attributes[:starts_at])
    )

    render json: AppointmentRequestSerializer.call(request), status: :created
  end

  def accept
    request = AppointmentRequests::Accept.call(params[:id])

    render json: AppointmentRequestSerializer.call(request)
  end

  def reject
    request = AppointmentRequests::Reject.call(params[:id])

    render json: AppointmentRequestSerializer.call(request)
  end

  private

  def appointment_params
    params.permit(:guest_name, :guest_email, :service_id, :starts_at)
  end

  def index_params
    params.permit(:q, :status, :cursor, :limit)
  end

  def normalized_index_filters
    filters = index_params.to_h.symbolize_keys
    {
      q: filters[:q].to_s.strip.presence,
      status: filters[:status].presence || "pending"
    }
  end
end
