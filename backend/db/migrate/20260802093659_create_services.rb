class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.references :nutritionist, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :price_cents, null: false
      t.integer :duration_minutes, null: false
      t.string :location, null: false
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end

    add_check_constraint :services, "price_cents >= 0",
      name: "services_price_cents_non_negative"

    add_check_constraint :services, "duration_minutes > 0",
      name: "services_duration_minutes_positive"

    add_index :services, "lower(name)",
      name: "index_services_on_lower_name"

    add_index :services, "lower(location)",
      name: "index_services_on_lower_location"
  end
end
