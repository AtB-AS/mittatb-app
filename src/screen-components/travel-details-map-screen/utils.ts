import polyline from '@mapbox/polyline';
import {Feature, LineString, Point, Position} from 'geojson';
import {flatMap} from '@atb/utils/array';

import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {MapLeg} from '@atb/modules/map';
import {Coordinates} from '@atb/utils/coordinates';
import {CameraBounds} from '@rnmapbox/maps';
import {AnyMode} from '@atb/components/icon-box';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';

export interface MapLine extends Feature<LineString> {
  travelType?: AnyMode;
  subMode?: TransportSubmode;
  isFlexible?: boolean;
  faded?: boolean;
}

export function getMapBounds(features: MapLine[]): CameraBounds {
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

export function createMapLines(legs: MapLeg[]): MapLine[] {
  return legs
    .filter((leg) => leg.pointsOnLink?.points?.trim()?.length) // only include legs with line geometry
    .map((leg) => {
      const line = polyline.toGeoJSON(leg.pointsOnLink!.points!);
      return {
        type: 'Feature',
        properties: {},
        faded: leg.faded,
        travelType: leg.mode as unknown as Mode,
        subMode: leg.transportSubmode as unknown as TransportSubmode,
        geometry: line,
        isFlexible: isLineFlexibleTransport(leg.line),
      };
    });
}

export function pointOf(coords: Coordinates): Point;
export function pointOf(coordinates: Position): Point;
export function pointOf(placing: Coordinates | Position): Point;
export function pointOf(placing: Coordinates | Position): Point {
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
