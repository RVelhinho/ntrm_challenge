class AddAppointmentRequestCursorIndex < ActiveRecord::Migration[8.1]
  def change
    add_index :appointment_requests, [ :created_at, :id ],
      order: { created_at: :desc, id: :desc },
      name: "index_appointment_requests_on_created_at_and_id_desc"
  end
end
