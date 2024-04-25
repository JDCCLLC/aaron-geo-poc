// Define a type for the location
export type PocLocation = {
  pk: string;
  sk: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type BoundingBox = {
  nw: LatLng; // northwest corner
  se: LatLng; // southeast corner
};