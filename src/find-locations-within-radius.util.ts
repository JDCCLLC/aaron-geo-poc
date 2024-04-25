import { haversineDistance } from './haversine-distance.util';
import { PocLocation } from './types'

/**
 * Finds all locations within a specified radius from a given point.
 * @param locations Array of location objects.
 * @param centerLat Latitude of the center point.
 * @param centerLng Longitude of the center point.
 * @param radius Radius in miles.
 * @returns Array of locations within the radius.
 */
export function findLocationsWithinRadius(locations: PocLocation[], centerLat: number, centerLng: number, radius: number): PocLocation[] {
  return locations.filter(location => {
    const distance = haversineDistance(centerLat, centerLng, location.latitude, location.longitude);
    return distance <= radius;
  });
}