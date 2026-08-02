require "swagger_helper"

RSpec.describe "Nutritionists API", type: :request do
  path "/api/v1/nutritionists" do
    get "Search nutritionists and services" do
      tags "Nutritionists"
      produces "application/json"

      parameter name: :q, in: :query, required: false, schema: { type: :string }
      parameter name: :location, in: :query, required: false, schema: { type: :string }
      parameter name: :page, in: :query, required: false, schema: { type: :integer, minimum: 1 }
      parameter name: :per_page, in: :query, required: false, schema: { type: :integer, minimum: 1, maximum: 50 }
      parameter name: :latitude, in: :query, required: false, schema: { type: :number, minimum: -90, maximum: 90 }
      parameter name: :longitude, in: :query, required: false, schema: { type: :number, minimum: -180, maximum: 180 }

      response "200", "matching nutritionists" do
        let!(:nutritionist) { create(:nutritionist, name: "Dr. Braga") }
        let!(:service) { create(:service, nutritionist: nutritionist, name: "Nutrition consultation", location: "Braga") }
        let(:q) { "consultation" }
        let(:location) { "Braga" }

        let(:page) { 1 }
        let(:per_page) { 9 }

        schema type: :object, required: %w[items meta], properties: {
          items: {
            type: :array,
            items: {
          type: :object,
          required: %w[id name services],
          properties: {
            id: { type: :integer },
            name: { type: :string },
            biography: { type: :string, nullable: true },
            distance_km: { type: :number, nullable: true },
            services: {
              type: :array,
              items: {
                type: :object,
                required: %w[id name price_cents duration_minutes location],
                properties: {
                  id: { type: :integer },
                  name: { type: :string },
                  price_cents: { type: :integer },
                  duration_minutes: { type: :integer },
                  location: { type: :string },
                  latitude: { type: :number, nullable: true },
                  longitude: { type: :number, nullable: true }
                }
              }
            }
          }
            }
          },
          meta: {
            type: :object,
            required: %w[page per_page total_count total_pages location location_mode],
            properties: {
              page: { type: :integer }, per_page: { type: :integer }, total_count: { type: :integer },
              total_pages: { type: :integer }, location: { type: :string, nullable: true }, location_mode: { type: :string, enum: %w[all exact nearest] }
            }
          }
        }

        run_test!
      end

      response "200", "defaults to Braga when location is absent" do
        let!(:braga_nutritionist) { create(:nutritionist, name: "Braga Nutritionist") }
        let!(:braga_service) { create(:service, nutritionist: braga_nutritionist, location: "Braga") }
        let!(:other_nutritionist) { create(:nutritionist, name: "Porto Nutritionist") }
        let!(:other_service) { create(:service, nutritionist: other_nutritionist, location: "Porto") }
        let(:q) { nil }
        let(:location) { nil }

        let(:page) { 1 }
        let(:per_page) { 9 }
        schema type: :object, required: %w[items meta]
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["items"].map { |nutritionist| nutritionist["id"] }).to eq([braga_nutritionist.id])
          expect(body.dig("meta", "location")).to eq("Braga")
          expect(body.dig("meta", "location_mode")).to eq("exact")
        end
      end

      response "200", "defaults to Braga for an invalid location" do
        let!(:braga_nutritionist) { create(:nutritionist, name: "Braga Nutritionist") }
        let!(:braga_service) { create(:service, nutritionist: braga_nutritionist, location: "Braga") }
        let!(:other_nutritionist) { create(:nutritionist, name: "Porto Nutritionist") }
        let!(:other_service) { create(:service, nutritionist: other_nutritionist, location: "Porto") }
        let(:q) { nil }
        let(:location) { "Unknown" }

        schema type: :object, required: %w[items meta]
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["items"].map { |nutritionist| nutritionist["id"] }).to eq([braga_nutritionist.id])
          expect(body.dig("meta", "location")).to eq("Braga")
          expect(body.dig("meta", "location_mode")).to eq("exact")
        end
      end

      response "200", "paginates results" do
        let!(:nutritionists) { create_list(:nutritionist, 2) }
        let!(:services) { nutritionists.map { |nutritionist| create(:service, nutritionist: nutritionist, location: "Braga") } }
        let(:q) { nil }
        let(:location) { "Braga" }
        let(:page) { 2 }
        let(:per_page) { 1 }

        schema type: :object
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["items"].length).to eq(1)
          expect(body.dig("meta", "total_pages")).to eq(2)
        end
      end

      response "200", "orders by nearest coordinates" do
        let!(:near_nutritionist) { create(:nutritionist, name: "Near") }
        let!(:near_service) { create(:service, nutritionist: near_nutritionist, location: "Near", latitude: 41.55, longitude: -8.43) }
        let!(:far_nutritionist) { create(:nutritionist, name: "Far") }
        let!(:far_service) { create(:service, nutritionist: far_nutritionist, location: "Far", latitude: 41.20, longitude: -8.60) }
        let(:q) { nil }
        let(:location) { nil }
        let(:latitude) { 41.54 }
        let(:longitude) { -8.42 }
        let(:page) { 1 }
        let(:per_page) { 9 }

        schema type: :object
        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body.dig("items", 0, "id")).to eq(near_nutritionist.id)
          expect(body.dig("items", 0, "distance_km")).to be_a(Numeric)
          expect(body.dig("meta", "location_mode")).to eq("nearest")
        end
      end
    end
  end
end
