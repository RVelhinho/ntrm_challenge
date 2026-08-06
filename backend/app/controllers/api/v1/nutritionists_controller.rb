class Api::V1::NutritionistsController < ApplicationController
  def index
    result = NutritionistsSearch.call(search_params)
    page = OffsetPagination.call(
      scope: result.nutritionists,
      page: params[:page],
      limit: params[:limit]
    )

    render json: {
      items: page.records.map { |nutritionist| NutritionistSerializer.call(nutritionist) },
      page_info: {
        current_page: page.current_page,
        page_size: page.page_size,
        total_count: page.total_count,
        total_pages: page.total_pages,
        has_next_page: page.has_next_page,
        has_previous_page: page.has_previous_page
      },
      location: result.location,
      locations: result.locations
    }
  end

  private

  def search_params
    params.permit(:q, :name, :service, :location)
  end
end
