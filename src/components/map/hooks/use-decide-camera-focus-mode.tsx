import {
  CameraFocusModeType,
  FeatureOrCoordinates,
  MapSelectionMode,
} from '@atb/components/map/types';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {useEffect, useState} from 'react';
import {Feature, Point} from 'geojson';
import {createMapLines} from '@atb/screens/TripDetails/Map/utils';
import {
  getCoordinatesFromFeatureOrCoordinates,
  isCoordinates,
  mapPositionToCoordinates,
} from '@atb/components/map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

/**
 * Deciding the camera focus mode. The camera focus mode also returns the values
 * which the camera should focus on, like the coordinates, stop place or map
 * lines.
 *
 * Why is there a split between the "decide camera focus" and "trigger camera
 * move" hooks? This is both for simplifying the code a bit, since it was pretty
 * long and hard to read before it was splitt up. In addition, we need to return
 * the map lines back from the hook so the Map-component can draw them.
 */
export const useDecideCameraFocusMode = (
  selectionMode: MapSelectionMode,
  fromCoords: Coordinates | undefined,
  selectedFeatureOrCoords: FeatureOrCoordinates | undefined,
  stopPlaceFeature: Feature<Point> | undefined,
) => {
  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusModeType>();
  useEffect(() => {
    (async function () {
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
          const mapLines = await fetchMapLines(fromCoords, stopPlaceFeature);
          if (mapLines) {
            setCameraFocusMode({mode: 'map-lines', mapLines});
          } else if (stopPlaceFeature) {
            setCameraFocusMode({mode: 'stop-place', stopPlaceFeature});
          }
        }
      }
    })();
  }, [selectedFeatureOrCoords, stopPlaceFeature]);
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
