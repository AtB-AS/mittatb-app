import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';
import {createMapLines, MapLine} from '@atb/screens/TripDetails/Map/utils';
import React, {useEffect, useState} from 'react';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

const useWalkingRouteLines = (
  fromCoordinates: Coordinates,
  toCoordinates: Coordinates | null,
  shouldShowWalkingRouteToStop: boolean,
) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();

  useEffect(() => {
    if (shouldShowWalkingRouteToStop && toCoordinates) {
      getMapLines(fromCoordinates, toCoordinates).then((lines) => {
        setMapLines(lines);
      });
    }
  }, [fromCoordinates, toCoordinates]);

  return mapLines;
};

export default useWalkingRouteLines;

const getMapLines = async (
  fromCoordinates: Coordinates,
  toCoordinates: Coordinates,
) => {
  const result = await tripsSearch({
    from: {
      name: 'From Position',
      coordinates: fromCoordinates,
    },
    to: {
      name: 'To Position',
      coordinates: toCoordinates,
    },
    arriveBy: false,
    modes: {directMode: StreetMode.Foot},
  });
  const walkingTripPattern = result?.trip?.tripPatterns[0];

  if (
    walkingTripPattern?.walkDistance &&
    walkingTripPattern.walkDistance <= MAX_LIMIT_TO_SHOW_WALKING_TRIP
  ) {
    const tripLegs = walkingTripPattern?.legs;
    return tripLegs ? createMapLines(tripLegs) : undefined;
  }

  return undefined;
};
