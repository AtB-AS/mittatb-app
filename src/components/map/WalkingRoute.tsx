import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import React, {useEffect, useMemo, useState} from 'react';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {createMapLines} from '@atb/screens/TripDetails/Map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';
import {TripPattern} from '@atb/api/types/trips';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

const WalkingRoute = ({
  fromCoordinates,
  toCoordinates,
}: {
  fromCoordinates: Coordinates;
  toCoordinates: Coordinates;
}) => {
  const [walkingTripPattern, setWalkingTripPattern] = useState<TripPattern>();

  useEffect(() => {
    getWalkingTripPattern(fromCoordinates, toCoordinates);
  }, [fromCoordinates, toCoordinates]);

  const getWalkingTripPattern = async (
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
    setWalkingTripPattern(result?.trip?.tripPatterns[0]);
  };

  const mapLines = useMemo(() => {
    if (
      (walkingTripPattern?.walkDistance as number) <=
      MAX_LIMIT_TO_SHOW_WALKING_TRIP
    ) {
      const tripLegs = walkingTripPattern?.legs;
      return tripLegs ? createMapLines(tripLegs) : [];
    }
  }, [walkingTripPattern]);

  return mapLines ? <MapRoute lines={mapLines}></MapRoute> : <></>;
};

export default WalkingRoute;
