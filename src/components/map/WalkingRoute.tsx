import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import React, {useEffect, useState} from 'react';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {createMapLines, MapLine} from '@atb/screens/TripDetails/Map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

const WalkingRoute = ({
  fromCoordinates,
  toCoordinates,
}: {
  fromCoordinates: Coordinates;
  toCoordinates: Coordinates;
}) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();

  useEffect(() => {
    getMapLines(fromCoordinates, toCoordinates).then(setMapLines);
  }, [fromCoordinates, toCoordinates]);

  return mapLines ? <MapRoute lines={mapLines}></MapRoute> : null;
};

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
    walkingTripPattern.walkDistance &&
    walkingTripPattern.walkDistance <= MAX_LIMIT_TO_SHOW_WALKING_TRIP
  ) {
    const tripLegs = walkingTripPattern?.legs;
    return tripLegs ? createMapLines(tripLegs) : undefined;
  }

  return undefined;
};

export default WalkingRoute;
