class CreateAppointmentRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :appointment_requests do |t|
      t.references :guest, null: false, foreign_key: true
      t.references :nutritionist, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true

      t.datetime :starts_at, null: false
      t.datetime :ends_at, null: false
      t.integer :status, null: false, default: 0
      t.datetime :answered_at

      t.timestamps
    end

    add_check_constraint :appointment_requests,
      "ends_at > starts_at",
      name: "appointment_requests_ends_at_after_starts_at"

    add_index :appointment_requests, :status

    add_index :appointment_requests,
      [ :nutritionist_id, :starts_at, :ends_at ],
      name: "index_appointment_requests_on_nutritionist_and_time"

    add_index :appointment_requests,
      :guest_id,
      unique: true,
      where: "status = 0",
      name: "index_one_pending_request_per_guest"
  end
end
