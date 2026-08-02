class Api::V1::NutritionistsController < ApplicationController
  def index
    result = NutritionistsSearch.call(search_params)
    nutritionists = paginate(result.nutritionists)

    render json: {
      items: nutritionists[:items].map { |nutritionist| NutritionistSerializer.call(nutritionist, distance_km: result.distance_by_id[nutritionist.id]) },
      meta: pagination_meta(nutritionists, location: result.location, location_mode: result.location_mode)
    }
  end

  private

  def search_params
    params.permit(:q, :name, :service, :location, :latitude, :longitude, :page, :per_page)
  end

  def paginate(records)
    page = [ params.fetch(:page, 1).to_i, 1 ].max
    per_page = params.fetch(:per_page, 9).to_i.clamp(1, 50)
    total_count = records.length

    {
      items: records.slice((page - 1) * per_page, per_page) || [],
      page: page,
      per_page: per_page,
      total_count: total_count,
      total_pages: (total_count.to_f / per_page).ceil
    }
  end

  def pagination_meta(pagination, location:, location_mode:)
    pagination.except(:items).merge(location: location, location_mode: location_mode)
  end
end
