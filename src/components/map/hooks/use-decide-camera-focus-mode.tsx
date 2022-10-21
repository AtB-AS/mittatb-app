import {
  CameraFocusModeType,
  FeatureOrCoordinates,
  MapSelectionMode,
} from '@atb/components/map/types';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {RefObject, useEffect, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, Point} from 'geojson';
import {createMapLines} from '@atb/screens/TripDetails/Map/utils';
import {
  findClickedStopPlace,
  isCoordinates,
  mapPositionToCoordinates,
} from '@atb/components/map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

export const useDecideCameraFocusMode = (
  selectionMode: MapSelectionMode,
  fromCoords: Coordinates | undefined,
  selectedFeatureOrCoords: FeatureOrCoordinates | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusModeType>();
  useEffect(() => {
    (async function () {
      console.log('RUNNING DECIDE', selectedFeatureOrCoords);
      if (!selectedFeatureOrCoords) {
        setCameraFocusMode(undefined);
        return;
      }

      if (isCoordinates(selectedFeatureOrCoords)) {
        // Will be coordinates when the user pressed location arrow
        setCameraFocusMode({
          mode: 'coordinates',
          coordinates: selectedFeatureOrCoords,
        });
        return;
      }

      const clickedFeature = selectedFeatureOrCoords;

      switch (selectionMode) {
        case 'ExploreLocation': {
          setCameraFocusMode({
            mode: 'coordinates',
            coordinates: mapPositionToCoordinates(
              clickedFeature.geometry.coordinates,
            ),
          });
          break;
        }
        case 'ExploreStops': {
          const stopPlaceFeature = await findClickedStopPlace(
            clickedFeature,
            mapViewRef,
          );

          const mapLines = await fetchMapLines(fromCoords, stopPlaceFeature);
          if (mapLines) {
            setCameraFocusMode({mode: 'map-lines', mapLines, stopPlaceFeature});
          } else if (stopPlaceFeature) {
            setCameraFocusMode({mode: 'stop-place', stopPlaceFeature});
          }
        }
      }
    })();
  }, [selectedFeatureOrCoords]);
  return cameraFocusMode;
};

const fetchMapLines = async (
  fromCoords?: Coordinates,
  stopPlaceFeature?: Feature<Point>,
) => {
  if (!fromCoords || !stopPlaceFeature) return undefined;
  const stopPlaceCoords = mapPositionToCoordinates(
    stopPlaceFeature.geometry.coordinates,
  );
  const result = await tripsSearch({
    from: {
      name: 'From Position',
      coordinates: fromCoords,
    },
    to: {
      name: 'To Position',
      coordinates: stopPlaceCoords,
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
