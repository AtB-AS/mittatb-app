import {Leg, LegMode, Place} from '@entur/sdk';
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

  let en = [-180, -90];
  let ws = [180, 90];

  coordinates.forEach((coordinate) => {
    if (coordinate[0] > en[0]) en[0] = coordinate[0];
    else if (coordinate[0] < ws[0]) ws[0] = coordinate[0];
    if (coordinate[1] > en[1]) en[1] = coordinate[1];
    else if (coordinate[1] < ws[1]) ws[1] = coordinate[1];
  });
  // Coordinates given in the opposite order below is intentional
  // MapboxGL camera bounds are expected as geojson coordinates ([longitude, latitude]), even though the property naming on the expected type suggests the opposite.
  return {
    sw: ws,
    ne: en,
    paddingTop: padding / 2,
    paddingBottom: padding / 2,
    paddingLeft: padding,
    paddingRight: padding,
  };
}
export function legsToMapLines(legs: Leg[]): MapLine[] {
  const polyline = require('@mapbox/polyline');
  return legs.map((leg) => {
    const line = polyline.toGeoJSON(leg.pointsOnLink?.points);
    return {
      type: 'Feature',
      properties: {},
      travelType: leg.mode,
      publicCode: leg.line?.publicCode,
      geometry: line as LineString,
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
