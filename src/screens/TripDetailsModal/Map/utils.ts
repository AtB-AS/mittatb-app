import {Leg, LegMode, Place} from '@entur/sdk';
import polyline from '@mapbox/polyline';
import {Feature, LineString, Point, Position} from 'geojson';

export interface MapLine extends Feature {
  travelType?: LegMode;
  publicCode?: string;
}

export function getMapBounds(features: MapLine[], padding: number) {
  let coordinates: Position[] = [];
  features.forEach((f) => {
    coordinates = coordinates.concat((f.geometry as LineString)?.coordinates);
  });

  const sortedByNorth = coordinates.sort(compareByNorthernmost);
  const sortedByEast = coordinates.sort(compareByEasternmost);

  const westernMost = sortedByEast[sortedByEast.length - 1][0];
  const southernMost = sortedByNorth[sortedByNorth.length - 1][0];
  const easternMost = sortedByEast[0][0];
  const northernMost = sortedByNorth[0][0];

  // Coordinates given in the opposite order below is intentional
  // MapboxGL camera bounds are expected as geojson coordinates ([longitude, latitude]), even though the property naming on the expected type suggests the opposite.
  return {
    sw: [westernMost, southernMost],
    ne: [easternMost, northernMost],
    paddingTop: padding / 2,
    paddingBottom: padding / 2,
    paddingLeft: padding,
    paddingRight: padding,
  };
}
export function legsToMapLines(legs: Leg[]): MapLine[] {
  return legs.map((leg) => {
    const line = polyline.toGeoJSON(leg.pointsOnLink?.points);
    return {
      type: 'Feature',
      properties: {},
      travelType: leg.mode,
      publicCode: leg.line?.publicCode,
      geometry: line,
    };
  });
}
export function pointOf(place: Place): Point;
export function pointOf(coordinates: Position): Point;
export function pointOf(placing: any): Point {
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

function compareByNorthernmost(a: Position, b: Position): number {
  return a[1] > b[1] ? 1 : 0;
}
function compareByEasternmost(a: Position, b: Position): number {
  return a[0] > b[0] ? 1 : 0;
}
