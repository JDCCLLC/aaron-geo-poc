import { degreesToRadians } from "./degrees-to-radians.util";
import { earthRadiusMiles } from "./enums";
import { radiansToDegrees } from "./radians-to-degrees.util";
import { BoundingBox, LatLng } from "./types";

/**
 * Calculates the bounding box for a given latitude, longitude, and radius.
 */
export function calculateBoundingBox(center: LatLng, radius: number): BoundingBox {
  const lat = degreesToRadians(center.latitude);
  const lng = degreesToRadians(center.longitude);
  const radiusRatio = radius / earthRadiusMiles;

  const minLat = lat - radiusRatio;
  const maxLat = lat + radiusRatio;
  const minLng = lng - radiusRatio / Math.cos(lat);
  const maxLng = lng + radiusRatio / Math.cos(lat);

  return {
    nw: { latitude: radiansToDegrees(maxLat), longitude: radiansToDegrees(minLng) },
    se: { latitude: radiansToDegrees(minLat), longitude: radiansToDegrees(maxLng) }
  };
}