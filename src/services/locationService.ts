import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Request foreground location permission.
 * Returns true if granted.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Get current GPS coordinates at high accuracy.
 */
export const getCurrentCoordinates = async (): Promise<Coordinates> => {
  const data = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude:  data.coords.latitude,
    longitude: data.coords.longitude,
  };
};

/**
 * Convert coordinates to a readable address string.
 */
export const reverseGeocode = async (coords: Coordinates): Promise<string> => {
  const results = await Location.reverseGeocodeAsync(coords);
  if (!results || results.length === 0) {
    throw new Error('No address found for coordinates.');
  }
  return formatAddress(
    results[0].name       ?? '',
    results[0].city       ?? '',
    results[0].region     ?? '',
    results[0].postalCode ?? '',
  );
};

function formatAddress(
  name:       string,
  city:       string,
  region:     string,
  postalCode: string,
): string {
  return `${name}, ${city}, ${region} ${postalCode}`.trim();
}
