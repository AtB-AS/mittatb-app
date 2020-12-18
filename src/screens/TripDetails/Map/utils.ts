import polyline from '@mapbox/polyline';
import {Feature, LineString, Point, Position} from 'geojson';
import {Leg, LegMode, Place, TransportSubmode} from '../../../sdk';
import {flatMap} from '../../../utils/array';

export interface MapLine extends Feature<LineString> {
  travelType?: LegMode;
  subMode?: TransportSubmode;
}

export function getMapBounds(features: MapLine[]) {
  const lineLongitudes = flatMap(features, (f) => f.geometry.coordinates).map(
    ([lon, _]) => lon,
  );

  const lineLatitudes = flatMap(features, (f) => f.geometry.coordinates).map(
    ([_, lat]) => lat,
  );

  const westernMost = Math.min(...lineLongitudes);
  const easternMost = Math.max(...lineLongitudes);
  const northernMost = Math.max(...lineLatitudes);
  const southernMost = Math.min(...lineLatitudes);

  // Dividing by 3 here is arbitrary, seems to work
  // like a fine value for "padding"
  const latPadding = (northernMost - southernMost) / 3;
  const lonPadding = (westernMost - easternMost) / 3;

  // Coordinates given in the opposite order below is intentional
  // MapboxGL camera bounds are expected as geojson coordinates ([longitude, latitude]), even though the property naming on the expected type suggests the opposite.
  const sw = [westernMost + lonPadding, southernMost - latPadding];
  const ne = [easternMost - lonPadding, northernMost + latPadding];

  return {
    sw,
    ne,
  };
}
export function legsToMapLines(legs: Leg[]): MapLine[] {
  return legs
    .filter((leg) => leg.pointsOnLink?.points?.trim()?.length) // only include legs with line geometry
    .map((leg) => {
      const line = polyline.toGeoJSON(leg.pointsOnLink?.points);
      return {
        type: 'Feature',
        properties: {},
        travelType: leg.mode,
        subMode: leg.transportSubmode,
        geometry: line,
      };
    });
}
export function pointOf(place: Place): Point;
export function pointOf(coordinates: Position): Point;
export function pointOf(placing: Place | Position): Point {
  let coords: Position;
  if (Array.isArray(placing)) {
    coords = placing;
  } else {
    coords = [placing.longitude, placing.latitude];
  }
  return {
    type: 'Point',
    coordinates: coords,
  };
}
