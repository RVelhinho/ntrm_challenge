require "swagger_helper"

RSpec.describe "Nutritionists API", type: :request do
  path "/api/v1/nutritionists" do
    get "Search nutritionists and services" do
      tags "Nutritionists"
      produces "application/json"
      parameter name: :q, in: :query, required: false, schema: { type: :string }
      parameter name: :location, in: :query, required: false, schema: { type: :string }
      parameter name: :page, in: :query, required: false, schema: { type: :integer, minimum: 1, default: 1 }
      parameter name: :limit, in: :query, required: false, schema: { type: :integer, minimum: 1, maximum: 100, default: 20 }

      response "200", "matching nutritionists" do
        let!(:nutritionist) { create(:nutritionist, name: "Dr. Braga", gender: "female") }
        let!(:service) { create(:service, nutritionist: nutritionist, name: "Nutrition consultation", location: "Braga") }
        let(:q) { "consultation" }
        let(:location) { "braga" }
        let(:limit) { 20 }

        schema type: :object, required: %w[items page_info location locations], properties: {
          items: { type: :array, items: {
            type: :object, required: %w[id name services], properties: {
              id: { type: :integer }, name: { type: :string }, biography: { type: :string, nullable: true },
              gender: { type: :string, nullable: true },
              services: { type: :array, items: {
                type: :object, required: %w[id name price_cents duration_minutes location], properties: {
                  id: { type: :integer }, name: { type: :string }, price_cents: { type: :integer },
                  duration_minutes: { type: :integer }, location: { type: :string }
                }
              } }
            }
          } },
          page_info: { type: :object, required: %w[current_page page_size total_count total_pages has_next_page has_previous_page], properties: {
            current_page: { type: :integer }, page_size: { type: :integer }, total_count: { type: :integer },
            total_pages: { type: :integer }, has_next_page: { type: :boolean }, has_previous_page: { type: :boolean }
          } }, location: { type: :string },
          locations: { type: :array, items: { type: :string } }
        }
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body.dig("items", 0, "gender")).to eq("female")
          expect(body["location"]).to eq("Braga")
          expect(body["locations"]).to include("Braga")
        end
      end
    end
  end

  describe "GET /api/v1/nutritionists" do
    it "uses Braga when location is absent or not an exact canonical location" do
      braga = create(:nutritionist)
      create(:service, nutritionist: braga, location: "Braga")
      porto = create(:nutritionist)
      create(:service, nutritionist: porto, location: "Porto")

      [ nil, "Unknown" ].each do |location|
        get "/api/v1/nutritionists", params: { location: location }
        body = JSON.parse(response.body)
        expect(body["items"].pluck("id")).to eq([ braga.id ])
        expect(body["location"]).to eq("Braga")
      end
    end

    it "matches canonical locations case-insensitively" do
      upper = create(:nutritionist)
      lower = create(:nutritionist)
      create(:service, nutritionist: upper, location: "Braga")
      create(:service, nutritionist: lower, location: "braga")

      get "/api/v1/nutritionists", params: { location: "BRAGA" }

      body = JSON.parse(response.body)
      expect(body["items"].pluck("id")).to contain_exactly(upper.id, lower.id)
      expect(body["locations"].count { |location| location.casecmp?("Braga") }).to eq(1)
      expect(body["locations"]).to include(body["location"])
    end

    it "paginates by lower-case name and id with direct pages" do
      nutritionists = %w[alpha Alpha beta].map do |name|
        create(:nutritionist, name: name).tap { |record| create(:service, nutritionist: record, location: "Braga") }
      end
      expected_ids = nutritionists.sort_by { |record| [ record.name.downcase, record.id ] }.map(&:id)

      get "/api/v1/nutritionists", params: { page: 1, limit: 2 }
      first_page = JSON.parse(response.body)
      get "/api/v1/nutritionists", params: { page: 2, limit: 2 }

      expect(first_page["items"].pluck("id") + JSON.parse(response.body)["items"].pluck("id")).to eq(expected_ids)
    end

    it "applies pagination after the current filter" do
      nutritionist = create(:nutritionist, name: "Alpha")
      create(:service, nutritionist:, location: "Porto")
      braga = create(:nutritionist, name: "Zulu")
      create(:service, nutritionist: braga, location: "Braga")

      get "/api/v1/nutritionists", params: { page: 1, location: "Braga" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["items"].pluck("id")).to include(braga.id)
    end

    it "returns all page metadata on the first response" do
      create_list(:nutritionist, 3).each { |record| create(:service, nutritionist: record, location: "Braga") }

      get "/api/v1/nutritionists", params: { page: 1, limit: 1 }
      body = JSON.parse(response.body)

      expect(body.dig("page_info", "total_count")).to eq(3)
      expect(body.dig("page_info", "total_pages")).to eq(3)
      expect(body.dig("page_info", "has_next_page")).to be(true)
      expect(body.dig("page_info", "has_previous_page")).to be(false)
    end
  end
end
