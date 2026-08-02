import { createFileRoute } from '@tanstack/react-router';
import { NutritionistSearchPage } from '../../../pages/NutritionistSearchPage/NutritionistSearchPage';

export const Route = createFileRoute('/nutritionists/')({ component: NutritionistSearchPage });
