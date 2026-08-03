class AddGenderToNutritionists < ActiveRecord::Migration[8.1]
  def change
    add_column :nutritionists, :gender, :string
  end
end
