import * as Location from 'expo-location';
import { Linking, Platform, Alert } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}


 // Request foreground location permission.
 
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};


 //Check current permission status without triggering OS dialog.

export const checkLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Get current GPS coordinates
 * Tries cached position first for speed — fixes slow fetch issue
 * Falls back to fresh fetch if no cache available
 */
export const getCurrentCoordinates = async (): Promise<Coordinates> => {
  const cached = await Location.getLastKnownPositionAsync({
    maxAge:           60000, 
    requiredAccuracy: 500,   
  });

  if (cached) {
    return {
      latitude:  cached.coords.latitude,
      longitude: cached.coords.longitude,
    };
  }

  // Fresh fetch — used BestForNavigation for highest accuracy and overall navigation (since for traveling siya)
  const locationData = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
  });

  return {
    latitude:  locationData.coords.latitude,
    longitude: locationData.coords.longitude,
  };
};

 // Convert coordinates to a readable address string

export const reverseGeocode = async (coords: Coordinates): Promise<string> => {
  const address = await Location.reverseGeocodeAsync({
    latitude:  coords.latitude,
    longitude: coords.longitude,
  });

  return formatAddress(
    address[0].name       ?? '',
    address[0].city       ?? '',
    address[0].region     ?? '',
    address[0].postalCode ?? '',
  );
};


// Format address parts — mirrors professor's formatAddress exactly.

function formatAddress(
  name:       string,
  city:       string,
  region:     string,
  postalCode: string,
): string {
  return name + ', ' + city + ', ' + region + ' ' + postalCode;
}

/**
 * Open device settings for manual permission grant.
 */
export const openLocationSettings = (): void => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};