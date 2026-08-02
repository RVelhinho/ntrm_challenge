class Api::V1::AppointmentRequestsController < ApplicationController
  def index
    nutritionist = Nutritionist.find(params[:nutritionist_id])
    requests = nutritionist.appointment_requests.pending.includes(:guest, :service).order(:starts_at)
    page = [ params.fetch(:page, 1).to_i, 1 ].max
    per_page = params.fetch(:per_page, 3).to_i.clamp(1, 50)
    total_count = requests.count

    render json: {
      items: requests.offset((page - 1) * per_page).limit(per_page).map { |request| AppointmentRequestSerializer.call(request) },
      meta: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
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
end
