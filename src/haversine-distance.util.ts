import { degreesToRadians } from "./degrees-to-radians.util";
import { earthRadiusMiles } from "./enums";

/**
 * Calculates the Haversine distance between two points on the Earth.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns Distance in miles.
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {


  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const originLat = degreesToRadians(lat1);
  const destinationLat = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(originLat) * Math.cos(destinationLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}