import {
  CameraFocusModeType,
  FeatureOrCoordinates,
  MapSelectionMode,
} from '@atb/components/map/types';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {RefObject, useEffect, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, Point} from 'geojson';
import {createMapLines, MapLine} from '@atb/screens/TripDetails/Map/utils';
import {
  findClickedStopPlace,
  getCoordinatesFromFeatureOrCoordinates,
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
      setCameraFocusMode(undefined);
      if (!selectedFeatureOrCoords) {
        return;
      }

      switch (selectionMode) {
        case 'ExploreLocation': {
          setCameraFocusMode({
            mode: 'coordinates',
            coordinates: getCoordinatesFromFeatureOrCoordinates(
              selectedFeatureOrCoords,
            ),
          });
          break;
        }
        case 'ExploreStops': {
          if (isCoordinates(selectedFeatureOrCoords)) {
            setCameraFocusMode({
              mode: 'coordinates',
              coordinates: selectedFeatureOrCoords,
            });
          } else {
            const stopPlaceFeature = await findClickedStopPlace(
              selectedFeatureOrCoords,
              mapViewRef,
            );
            if (fromCoords && stopPlaceFeature) {
              const stopPlaceCoordinates = mapPositionToCoordinates(
                stopPlaceFeature.geometry.coordinates,
              );
              const mapLines = await fetchMapLines(
                fromCoords,
                stopPlaceCoordinates,
              );
              if (mapLines) {
                setCameraFocusMode({mode: 'map-lines', mapLines});
                return;
              }
            }
            if (stopPlaceFeature) {
              console.log("STOPPLACEFEATURE", stopPlaceFeature)
              console.log("STOPPLACEFEATURE", stopPlaceFeature.bbox)
              setCameraFocusMode({mode: 'stop-place', stopPlaceFeature});
            }
          }
        }
      }
    })();
  }, [selectedFeatureOrCoords]);
  return cameraFocusMode;
};

const fetchMapLines = async (
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
