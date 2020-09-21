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
  let ne = [90, -180];
  let sw = [-90, 180];

  coordinates.forEach((c) => {
    if (c[0] < ne[0]) ne[0] = c[0];
    else if (c[0] > sw[0]) sw[0] = c[0];
    if (c[1] > ne[1]) ne[1] = c[1];
    else if (c[1] < sw[1]) sw[1] = c[1];
  });

  return {
    ne: ne,
    sw: sw,
    paddingTop: padding,
    paddingBottom: padding,
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
