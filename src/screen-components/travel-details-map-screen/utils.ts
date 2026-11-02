import polyline from '@mapbox/polyline';
import {Feature, LineString, Point, Position} from 'geojson';
import {flatMap} from '@atb/utils/array';

import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  ServiceJourneyPolyline,
  ServiceJourneyPolylinesWithId,
} from '@atb/api/types/serviceJourney';
import {Leg} from '@atb/api/types/trips';
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

/**
 * Gets the camera bounds for the map lines, focusing on the non-faded lines.
 * Faded lines show the parts of a service journey before boarding or after
 * alighting.
 */
export function getMapBounds(
  features: MapLine[],
  extraPoints: Position[] = [],
): CameraBounds {
  const nonFadedFeatures = features.filter((f) => !f.faded);
  const boundsFeatures = nonFadedFeatures.length ? nonFadedFeatures : features;
  const positions = [
    ...flatMap(boundsFeatures, (f) => f.geometry.coordinates),
    ...extraPoints,
  ];

  const longitudes = positions.map(([lon, _]) => lon);
  const latitudes = positions.map(([_, lat]) => lat);

  const westernMost = Math.min(...longitudes);
  const easternMost = Math.max(...longitudes);
  const northernMost = Math.max(...latitudes);
  const southernMost = Math.min(...latitudes);

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

export function createMapLines(
  serviceJourneyPolylines: ServiceJourneyPolyline[],
): MapLine[] {
  return serviceJourneyPolylines
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

/**
 * Combines the trip legs with the faded part of each service journey before
 * the boarding stop. The faded lines come first so they are drawn below the
 * trip legs.
 *
 * Relies on the BFF returning the map legs of a service journey in the order
 * before, main, after.
 */
export function createTripMapLegs(
  legs: Leg[],
  serviceJourneysPolylines: ServiceJourneyPolylinesWithId[],
): ServiceJourneyPolyline[] {
  const beforeBoardingMapLegs = legs.flatMap((leg) => {
    const mapLegs = serviceJourneysPolylines.find(
      (p) => p.serviceJourneyId === leg.serviceJourney?.id,
    )?.mapLegs;
    if (!mapLegs) return [];
    const mainMapLegIndex = mapLegs.findIndex((mapLeg) => !mapLeg.faded);
    const hasBeforeBoardingMapLegs = mainMapLegIndex > 0;
    return hasBeforeBoardingMapLegs ? mapLegs.slice(0, mainMapLegIndex) : [];
  });
  return [...beforeBoardingMapLegs, ...legs];
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
