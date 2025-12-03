import {Coordinates} from '@atb/utils/coordinates';
import {point} from '@turf/helpers';
import {toMercator, toWgs84} from '@turf/projection';

/**
 * Snaps a geographic coordinate to the center of the nearest grid cell of a given size (in meters).
 *
 * Converts the coordinate to Web Mercator, snaps it to the grid, and converts it back to WGS84.
 *
 * @param coordinates - The geographic coordinates to snap (latitude, longitude).
 * @param cellSizeMeters - The size of each grid cell in meters.
 * @returns The snapped geographic coordinates (latitude, longitude).
 */
export function snapCoordinatesToGrid(
  coordinates: Coordinates,
  cellSizeMeters: number,
): Coordinates {
  const {latitude, longitude} = coordinates;

  // Convert to Web Mercator (units in meters)
  const mercator = toMercator(point([longitude, latitude]));
  const [x, y] = mercator.geometry.coordinates;

  // Snap to grid (to center of the cell)
  const snappedX = (Math.floor(x / cellSizeMeters) + 0.5) * cellSizeMeters;
  const snappedY = (Math.floor(y / cellSizeMeters) + 0.5) * cellSizeMeters;

  // Convert back to WGS84
  const snapped = toWgs84(point([snappedX, snappedY]));
  const [snappedLng, snappedLat] = snapped.geometry.coordinates;

  // turf projections are not exact, so must be rounded to avoid "random noise"
  return {
    latitude: round(snappedLat, 10),
    longitude: round(snappedLng, 10),
  };
}

function round(n: number, decimals = 10) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
