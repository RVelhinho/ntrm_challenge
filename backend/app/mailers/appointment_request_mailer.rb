class AppointmentRequestMailer < ApplicationMailer
  def accepted(appointment_request)
    @appointment_request = appointment_request
    mail(
      to: appointment_request.guest.email,
      subject: I18n.t("appointment_request_mailer.accepted.subject")
    )
  end

  def rejected(appointment_request)
    @appointment_request = appointment_request
    mail(
      to: appointment_request.guest.email,
      subject: I18n.t("appointment_request_mailer.rejected.subject")
    )
  end
end
