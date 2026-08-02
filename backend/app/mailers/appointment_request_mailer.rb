class AppointmentRequestMailer < ApplicationMailer
  def self.accepted(request)
    with(appointment_request: request).accepted
  end

  def self.rejected(request)
    with(appointment_request: request).rejected
  end

  def accepted
    appointment_request = params[:appointment_request]
    mail(to: appointment_request.guest.email, subject: "Your appointment request was accepted", body: "Your appointment request was accepted.")
  end

  def rejected
    appointment_request = params[:appointment_request]
    mail(to: appointment_request.guest.email, subject: "Your appointment request was rejected", body: "Your appointment request was rejected.")
  end
end
