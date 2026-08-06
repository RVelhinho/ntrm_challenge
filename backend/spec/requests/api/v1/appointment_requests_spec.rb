require "swagger_helper"

RSpec.describe "Appointment Requests API", type: :request do
  appointment_schema = {
    type: :object,
    required: %w[id guest nutritionist service starts_at ends_at status answered_at],
    properties: {
      id: { type: :integer },
      guest: { type: :object, required: %w[id name email], properties: {
        id: { type: :integer }, name: { type: :string }, email: { type: :string, format: :email }
      } },
      nutritionist: { type: :object, required: %w[id name], properties: {
        id: { type: :integer }, name: { type: :string }
      } },
      service: { type: :object, required: %w[id name], properties: {
        id: { type: :integer }, name: { type: :string }
      } },
      starts_at: { type: :string, format: :"date-time" },
      ends_at: { type: :string, format: :"date-time" },
      status: { type: :string, enum: %w[pending accepted rejected superseded] },
      answered_at: { type: :string, format: :"date-time", nullable: true }
    }
  }
  error_schema = {
    type: :object,
    required: %w[error],
    properties: { error: { type: :object, required: %w[code message], properties: {
      code: { type: :string }, message: { type: :string }, details: { type: :object, additionalProperties: true }
    } } }
  }

  path "/api/v1/appointment_requests" do
    get "List appointment requests across all nutritionists" do
      tags "Appointment Requests"
      produces "application/json"
      parameter name: :q, in: :query, required: false, schema: { type: :string }
      parameter name: :status, in: :query, required: false, schema: { type: :string, enum: %w[pending accepted rejected superseded all], default: "pending" }
      parameter name: :cursor, in: :query, required: false, schema: { type: :string }
      parameter name: :limit, in: :query, required: false, schema: { type: :integer, minimum: 1, maximum: 100, default: 20 }

      response "200", "appointment request page" do
        let!(:request_record) { create(:appointment_request) }
        let(:q) { request_record.guest.email }
        let(:status) { "pending" }
        let(:limit) { 20 }

        schema type: :object, required: %w[data page_info], properties: {
          data: { type: :array, items: appointment_schema },
          page_info: { type: :object, required: %w[page_size has_next_page has_previous_page next_cursor], properties: {
            page_size: { type: :integer }, has_next_page: { type: :boolean },
            has_previous_page: { type: :boolean }, next_cursor: { type: :string, nullable: true }
          } }
        }
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body.dig("data", 0, "nutritionist", "name")).to eq(request_record.nutritionist.name)
          expect(body.dig("page_info", "has_next_page")).to be(false)
        end
      end

      response "400", "invalid cursor" do
        let(:cursor) { "not-a-valid-cursor" }
        schema error_schema
        run_test! do |response|
          expect(JSON.parse(response.body).dig("error", "code")).to eq("invalid_cursor")
        end
      end
    end

    post "Create an appointment request" do
      tags "Appointment Requests"
      consumes "application/json"
      produces "application/json"
      parameter name: :appointment_request, in: :body, required: true, schema: {
        type: :object,
        required: %w[guest_name guest_email service_id starts_at],
        properties: {
          guest_name: { type: :string }, guest_email: { type: :string, format: :email },
          service_id: { type: :integer }, starts_at: { type: :string, format: :"date-time" }
        }
      }

      response "201", "created appointment request" do
        let(:service) { create(:service) }
        let(:appointment_request) do
          { guest_name: "Guest", guest_email: "guest@example.com", service_id: service.id, starts_at: "2026-08-03T10:00:00Z" }
        end
        schema appointment_schema
        run_test!
      end

      response "409", "time overlaps an accepted appointment" do
        let(:service) { create(:service) }
        let!(:accepted) do
          create(:appointment_request, :accepted, service: service, nutritionist: service.nutritionist,
            starts_at: Time.zone.parse("2026-08-03 10:00"), ends_at: Time.zone.parse("2026-08-03 11:00"))
        end
        let(:appointment_request) do
          { guest_name: "Guest", guest_email: "guest@example.com", service_id: service.id, starts_at: "2026-08-03T10:30:00Z" }
        end
        schema error_schema
        run_test! do |response|
          expect(JSON.parse(response.body).dig("error", "code")).to eq("appointment_unavailable")
        end
      end

      response "422", "invalid appointment request" do
        let(:appointment_request) { {} }
        schema error_schema
        run_test!
      end
    end
  end

  path "/api/v1/appointment_requests/{id}/accept" do
    patch "Accept an appointment request" do
      tags "Appointment Requests"
      produces "application/json"
      parameter name: :id, in: :path, required: true, schema: { type: :integer }

      response "200", "accepted request" do
        let(:record) { create(:appointment_request) }
        let(:id) { record.id }
        schema appointment_schema
        run_test!
      end

      response "409", "request is not pending" do
        let(:record) { create(:appointment_request, :rejected) }
        let(:id) { record.id }
        schema error_schema
        run_test!
      end
    end
  end

  path "/api/v1/appointment_requests/{id}/reject" do
    patch "Reject an appointment request" do
      tags "Appointment Requests"
      produces "application/json"
      parameter name: :id, in: :path, required: true, schema: { type: :integer }

      response "200", "rejected request" do
        let(:record) { create(:appointment_request) }
        let(:id) { record.id }
        schema appointment_schema
        run_test!
      end

      response "409", "request is not pending" do
        let(:record) { create(:appointment_request, :accepted) }
        let(:id) { record.id }
        schema error_schema
        run_test!
      end
    end
  end

  describe "GET /api/v1/appointment_requests" do
    it "defaults to pending and searches every supported field" do
      nutritionist = create(:nutritionist, name: "Maria Searchable")
      service = create(:service, nutritionist: nutritionist, name: "Metabolic Searchable")
      pending = create(:appointment_request, nutritionist: nutritionist, service: service,
        guest: create(:guest, name: "Guest Searchable", email: "searchable@example.com"))
      create(:appointment_request, :rejected)

      [ "Guest Searchable", "searchable@example.com", "Metabolic Searchable", "Maria Searchable" ].each do |query|
        get "/api/v1/appointment_requests", params: { q: query }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["data"].pluck("id")).to eq([ pending.id ])
      end
    end

    it "orders by descending created_at and id without gaps across cursor pages" do
      created_at = Time.zone.parse("2026-08-06 10:00:00.123456")
      records = create_list(:appointment_request, 3).each { |record| record.update_column(:created_at, created_at) }
      expected_ids = records.sort_by { |record| [ -record.created_at.to_f, -record.id ] }.map(&:id)

      get "/api/v1/appointment_requests", params: { limit: 2 }
      first_page = JSON.parse(response.body)
      get "/api/v1/appointment_requests", params: { cursor: first_page.dig("page_info", "next_cursor"), limit: 2 }
      second_page = JSON.parse(response.body)

      expect(first_page["data"].pluck("id") + second_page["data"].pluck("id")).to eq(expected_ids)
      expect(first_page.dig("page_info", "has_previous_page")).to be(false)
      expect(second_page.dig("page_info", "has_previous_page")).to be(true)
      expect(second_page.dig("page_info", "has_next_page")).to be(false)
      expect(second_page.dig("page_info", "next_cursor")).to be_nil
    end

    it "rejects a cursor when the active filters change" do
      nutritionist = create(:nutritionist, name: "Searchable Nutritionist")
      service = create(:service, nutritionist:)
      3.times { create(:appointment_request, nutritionist:, service:) }

      get "/api/v1/appointment_requests", params: { q: nutritionist.name, limit: 2 }
      first_page = JSON.parse(response.body)
      get "/api/v1/appointment_requests", params: { q: "different", cursor: first_page.dig("page_info", "next_cursor"), limit: 2 }

      expect(response).to have_http_status(:bad_request)
      expect(JSON.parse(response.body).dig("error", "code")).to eq("invalid_cursor")
    end

    it "clamps the requested limit" do
      get "/api/v1/appointment_requests", params: { limit: 0 }
      expect(JSON.parse(response.body).dig("page_info", "page_size")).to eq(1)

      get "/api/v1/appointment_requests", params: { limit: 1000 }
      expect(JSON.parse(response.body).dig("page_info", "page_size")).to eq(100)
    end

    it "returns empty cursor metadata when there are no matches" do
      get "/api/v1/appointment_requests", params: { q: "no matching request", limit: 20 }
      body = JSON.parse(response.body)
      expect(body["data"]).to be_empty
      expect(body["page_info"]).to include("has_next_page" => false, "has_previous_page" => false, "next_cursor" => nil)
    end
  end
end
