require "swagger_helper"

RSpec.describe "Appointment Requests API", type: :request do
  path "/api/v1/nutritionists/{nutritionist_id}/appointment_requests" do
    get "List pending requests for a nutritionist" do
      tags "Appointment Requests"
      produces "application/json"
      parameter name: :nutritionist_id, in: :path, required: true, schema: { type: :integer }
      parameter name: :page, in: :query, required: false, schema: { type: :integer, minimum: 1 }
      parameter name: :per_page, in: :query, required: false, schema: { type: :integer, minimum: 1, maximum: 50 }

      response "200", "pending requests" do
        let!(:nutritionist) { create(:nutritionist) }
        let(:nutritionist_id) { nutritionist.id }
        let(:page) { 1 }
        let(:per_page) { 3 }

        schema type: :object, required: %w[items meta], properties: {
          items: { type: :array, items: {
          type: :object,
          required: %w[id guest nutritionist_id service starts_at ends_at status answered_at],
          properties: {
            id: { type: :integer },
            guest: { type: :object, required: %w[id name email], properties: { id: { type: :integer }, name: { type: :string }, email: { type: :string, format: :email } } },
            nutritionist_id: { type: :integer },
            service: { type: :object, required: %w[id name], properties: { id: { type: :integer }, name: { type: :string } } },
            starts_at: { type: :string, format: :date_time },
            ends_at: { type: :string, format: :date_time },
            status: { type: :string, enum: %w[pending accepted rejected superseded] },
            answered_at: { type: :string, format: :date_time, nullable: true }
          } } },
          meta: { type: :object, required: %w[page per_page total_count total_pages], properties: { page: { type: :integer }, per_page: { type: :integer }, total_count: { type: :integer }, total_pages: { type: :integer } } }
        }
        run_test!
      end
    end
  end

  path "/api/v1/appointment_requests" do
    post "Create an appointment request" do
      tags "Appointment Requests"
      consumes "application/json"
      produces "application/json"
      parameter name: :appointment_request, in: :body, required: true, schema: {
        type: :object,
        required: %w[guest_name guest_email service_id starts_at],
        properties: {
          guest_name: { type: :string },
          guest_email: { type: :string, format: :email },
          service_id: { type: :integer },
          starts_at: { type: :string, format: :date_time }
        }
      }

      response "201", "created appointment request" do
        let(:service) { create(:service) }
        let(:appointment_request) do
          {
            guest_name: "Guest",
            guest_email: "guest@example.com",
            service_id: service.id,
            starts_at: "2026-08-03T10:00:00Z"
          }
        end

        schema type: :object, required: %w[id guest nutritionist_id service starts_at ends_at status answered_at], properties: {
          id: { type: :integer },
          guest: { type: :object, required: %w[id name email], properties: { id: { type: :integer }, name: { type: :string }, email: { type: :string, format: :email } } },
          nutritionist_id: { type: :integer },
          service: { type: :object, required: %w[id name], properties: { id: { type: :integer }, name: { type: :string } } },
          starts_at: { type: :string, format: :date_time },
          ends_at: { type: :string, format: :date_time },
          status: { type: :string, enum: %w[pending accepted rejected superseded] },
          answered_at: { type: :string, format: :date_time, nullable: true }
        }
        run_test!
      end

      response "422", "invalid appointment request" do
        let(:appointment_request) { {} }
        schema type: :object, required: [:error], properties: {
          error: {
            type: :object,
            required: %w[code message],
            properties: {
              code: { type: :string },
              message: { type: :string },
              details: { type: :object, additionalProperties: true }
            }
          }
        }
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
        let(:appointment_request) { create(:appointment_request) }
        let(:id) { appointment_request.id }

        schema type: :object, required: %w[id guest nutritionist_id service starts_at ends_at status answered_at], properties: {
          id: { type: :integer },
          guest: { type: :object, required: %w[id name email], properties: { id: { type: :integer }, name: { type: :string }, email: { type: :string, format: :email } } },
          nutritionist_id: { type: :integer },
          service: { type: :object, required: %w[id name], properties: { id: { type: :integer }, name: { type: :string } } },
          starts_at: { type: :string, format: :date_time },
          ends_at: { type: :string, format: :date_time },
          status: { type: :string, enum: %w[pending accepted rejected superseded] },
          answered_at: { type: :string, format: :date_time, nullable: true }
        }
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
        let(:appointment_request) { create(:appointment_request) }
        let(:id) { appointment_request.id }

        schema type: :object, required: %w[id guest nutritionist_id service starts_at ends_at status answered_at], properties: {
          id: { type: :integer },
          guest: { type: :object, required: %w[id name email], properties: { id: { type: :integer }, name: { type: :string }, email: { type: :string, format: :email } } },
          nutritionist_id: { type: :integer },
          service: { type: :object, required: %w[id name], properties: { id: { type: :integer }, name: { type: :string } } },
          starts_at: { type: :string, format: :date_time },
          ends_at: { type: :string, format: :date_time },
          status: { type: :string, enum: %w[pending accepted rejected superseded] },
          answered_at: { type: :string, format: :date_time, nullable: true }
        }
        run_test!
      end
    end
  end
end
