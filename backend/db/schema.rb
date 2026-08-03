# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_03_095134) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "appointment_requests", force: :cascade do |t|
    t.datetime "answered_at"
    t.datetime "created_at", null: false
    t.datetime "ends_at", null: false
    t.bigint "guest_id", null: false
    t.bigint "nutritionist_id", null: false
    t.bigint "service_id", null: false
    t.datetime "starts_at", null: false
    t.integer "status", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["guest_id"], name: "index_appointment_requests_on_guest_id"
    t.index ["guest_id"], name: "index_one_pending_request_per_guest", unique: true, where: "(status = 0)"
    t.index ["nutritionist_id", "starts_at", "ends_at"], name: "index_appointment_requests_on_nutritionist_and_time"
    t.index ["nutritionist_id"], name: "index_appointment_requests_on_nutritionist_id"
    t.index ["service_id"], name: "index_appointment_requests_on_service_id"
    t.index ["status"], name: "index_appointment_requests_on_status"
    t.check_constraint "ends_at > starts_at", name: "appointment_requests_ends_at_after_starts_at"
  end

  create_table "guests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_guests_on_lower_email", unique: true
  end

  create_table "nutritionists", force: :cascade do |t|
    t.text "biography"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "gender"
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_nutritionists_on_email", unique: true
  end

  create_table "services", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "duration_minutes", null: false
    t.decimal "latitude"
    t.string "location", null: false
    t.decimal "longitude"
    t.string "name", null: false
    t.bigint "nutritionist_id", null: false
    t.integer "price_cents", null: false
    t.datetime "updated_at", null: false
    t.index "lower((location)::text)", name: "index_services_on_lower_location"
    t.index "lower((name)::text)", name: "index_services_on_lower_name"
    t.index ["nutritionist_id"], name: "index_services_on_nutritionist_id"
    t.check_constraint "duration_minutes > 0", name: "services_duration_minutes_positive"
    t.check_constraint "price_cents >= 0", name: "services_price_cents_non_negative"
  end

  add_foreign_key "appointment_requests", "guests"
  add_foreign_key "appointment_requests", "nutritionists"
  add_foreign_key "appointment_requests", "services"
  add_foreign_key "services", "nutritionists"
end
