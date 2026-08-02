import type { GetApiV1Nutritionists200ItemsItem } from '../../api/generated/models';

export function searchOptions(nutritionists: GetApiV1Nutritionists200ItemsItem[] | undefined) {
  const values =
    nutritionists?.flatMap((nutritionist) => [
      nutritionist.name,
      ...nutritionist.services.map((service) => service.name),
    ]) ?? [];
  return [...new Set(values)].sort();
}

export function locationOptions(nutritionists: GetApiV1Nutritionists200ItemsItem[] | undefined) {
  const values =
    nutritionists?.flatMap((nutritionist) =>
      nutritionist.services.map((service) => service.location),
    ) ?? [];
  return [...new Set(['Braga', 'Porto', ...values])].sort();
}
