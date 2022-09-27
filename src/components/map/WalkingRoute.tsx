import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import React, {RefObject, useEffect, useState} from 'react';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {createMapLines, MapLine} from '@atb/screens/TripDetails/Map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';
import MapboxGL from '@react-native-mapbox-gl/maps';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

const WalkingRoute = ({
  fromCoordinates,
  toCoordinates,
  mapCameraRef,
}: {
  fromCoordinates: Coordinates;
  toCoordinates: Coordinates;
  mapCameraRef: RefObject<MapboxGL.Camera>;
}) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();

  const centraliseWalkingRoute = () => {
    mapCameraRef.current?.fitBounds(
      [fromCoordinates.longitude, fromCoordinates.latitude],
      [toCoordinates.longitude, toCoordinates.latitude],
      [100, 100],
      1000,
    );
  };

  const flyToLocation = () => {
    mapCameraRef.current?.flyTo(
      [toCoordinates.longitude, toCoordinates.latitude],
      500,
    );
  };

  useEffect(() => {
    getMapLines(fromCoordinates, toCoordinates).then((lines) => {
      if (lines) {
        setMapLines(lines);
        centraliseWalkingRoute();
      } else {
        flyToLocation();
      }
    });
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
    walkingTripPattern?.walkDistance &&
    walkingTripPattern.walkDistance <= MAX_LIMIT_TO_SHOW_WALKING_TRIP
  ) {
    const tripLegs = walkingTripPattern?.legs;
    return tripLegs ? createMapLines(tripLegs) : undefined;
  }

  return undefined;
};

export default WalkingRoute;
