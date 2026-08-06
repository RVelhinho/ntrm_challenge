class HardenAppointmentRequestsAndRemoveCoordinates < ActiveRecord::Migration[8.1]
  def up
    remove_column :services, :latitude, :decimal
    remove_column :services, :longitude, :decimal

    execute "UPDATE appointment_requests SET answered_at = COALESCE(answered_at, updated_at) WHERE status IN (1, 2)"
    execute "UPDATE appointment_requests SET answered_at = NULL WHERE status IN (0, 3)"
    resolve_existing_accepted_overlaps

    add_check_constraint :appointment_requests,
      "status IN (0, 1, 2, 3)",
      name: "appointment_requests_valid_status"
    add_check_constraint :appointment_requests,
      "(status IN (0, 3) AND answered_at IS NULL) OR (status IN (1, 2) AND answered_at IS NOT NULL)",
      name: "appointment_requests_answered_at_matches_status"

    add_index :services, [ :id, :nutritionist_id ], unique: true, name: "index_services_on_id_and_nutritionist_id"
    add_foreign_key :appointment_requests, :services,
      column: [ :service_id, :nutritionist_id ],
      primary_key: [ :id, :nutritionist_id ],
      name: "fk_appointment_service_nutritionist"

    enable_extension "btree_gist" unless extension_enabled?("btree_gist")
    execute <<~SQL
      ALTER TABLE appointment_requests
      ADD CONSTRAINT appointment_requests_no_accepted_overlap
      EXCLUDE USING gist (
        nutritionist_id WITH =,
        tsrange(starts_at, ends_at, '[)') WITH &&
      ) WHERE (status = 1)
    SQL
  end

  def down
    execute "ALTER TABLE appointment_requests DROP CONSTRAINT appointment_requests_no_accepted_overlap"
    remove_foreign_key :appointment_requests, name: "fk_appointment_service_nutritionist"
    remove_index :services, name: "index_services_on_id_and_nutritionist_id"
    remove_check_constraint :appointment_requests, name: "appointment_requests_answered_at_matches_status"
    remove_check_constraint :appointment_requests, name: "appointment_requests_valid_status"
    add_column :services, :latitude, :decimal
    add_column :services, :longitude, :decimal
  end

  private

  # Preserve earlier decisions and reject later accepted rows that conflict with them.
  def resolve_existing_accepted_overlaps
    request_class = Class.new(ActiveRecord::Base) do
      self.table_name = "appointment_requests"
    end

    request_class.where(status: 1).distinct.pluck(:nutritionist_id).each do |nutritionist_id|
      accepted = request_class.where(status: 1, nutritionist_id:)
        .order(Arel.sql("COALESCE(answered_at, created_at) ASC"), :id)
        .to_a
      retained = []

      accepted.each do |request|
        overlaps = retained.any? do |existing|
          existing.starts_at < request.ends_at && existing.ends_at > request.starts_at
        end

        if overlaps
          request.update_columns(status: 2, answered_at: request.answered_at || request.updated_at)
        else
          retained << request
        end
      end
    end
  end
end
