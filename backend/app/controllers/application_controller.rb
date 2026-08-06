class ApplicationController < ActionController::API
  wrap_parameters false

  rescue_from DomainError do |error|
    render json: { error: { code: error.code, message: error.message } }, status: error.status
  end

  rescue_from ActionController::ParameterMissing do |error|
    render json: { error: { code: "invalid_request", message: error.message } }, status: :unprocessable_entity
  end

  rescue_from ActiveRecord::RecordNotFound do |error|
    render json: { error: { code: "not_found", message: error.message } }, status: :not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |error|
    render json: { error: { code: "invalid_record", message: error.message, details: error.record.errors.to_hash } }, status: :unprocessable_entity
  end

  rescue_from ArgumentError do |error|
    render json: { error: { code: "invalid_request", message: error.message } }, status: :unprocessable_entity
  end
end
