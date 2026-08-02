const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export type Coordinates = { latitude: number; longitude: number };

type ReverseGeocodeResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
  };
};

function isReverseGeocodeResponse(value: unknown): value is ReverseGeocodeResponse {
  return typeof value === 'object' && value !== null;
}

export async function reverseGeocode({
  latitude,
  longitude,
}: Coordinates): Promise<string | undefined> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
  });
  const response = await fetch(`${NOMINATIM_URL}?${params}`);

  if (!response.ok) throw new Error(`Reverse geocoding failed with status ${response.status}`);

  const data: unknown = await response.json();
  if (!isReverseGeocodeResponse(data))
    throw new Error('Reverse geocoding returned an invalid response');

  return data.address?.city ?? data.address?.town ?? data.address?.village;
}
