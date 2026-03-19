// ─────────────────────────────────────────────
// locationService — expo-location abstraction
// Based on professor's GeolocationScreen pattern
// Handles permission requests, coordinate fetch,
// and reverse geocoding in one clean API
// ─────────────────────────────────────────────

import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Request foreground location permission.
 * Returns true if granted, false otherwise.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Fetch the device's current GPS coordinates.
 * Uses High accuracy for best results.
 * Throws if location services are unavailable.
 */
export const getCurrentCoordinates = async (): Promise<Coordinates> => {
  const locationData = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: locationData.coords.latitude,
    longitude: locationData.coords.longitude,
  };
};

/**
 * Convert GPS coordinates to a human-readable address string.
 * Uses the same formatAddress pattern from professor's example.
 */
export const reverseGeocode = async (coords: Coordinates): Promise<string> => {
  const results = await Location.reverseGeocodeAsync(coords);
  if (!results || results.length === 0) {
    throw new Error('No address found for these coordinates.');
  }
  return formatAddress(
    results[0].name       ?? '',
    results[0].city       ?? '',
    results[0].region     ?? '',
    results[0].postalCode ?? '',
  );
};

/**
 * Format address parts into a single readable string.
 * Mirrors the professor's formatAddress function exactly.
 */
function formatAddress(
  name: string,
  city: string,
  region: string,
  postalCode: string,
): string {
  return `${name}, ${city}, ${region} ${postalCode}`.trim();
}