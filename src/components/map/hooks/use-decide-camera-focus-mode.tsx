import {
  CameraFocusModeType,
  MapSelectionMode,
  MapSelectionActionType,
} from '@atb/components/map/types';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {RefObject, useEffect, useState} from 'react';
import {Feature, Point} from 'geojson';
import {createMapLines} from '@atb/screens/TripDetails/Map/utils';
import {
  findStopPlaceAtClick,
  mapPositionToCoordinates,
} from '@atb/components/map/utils';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';
import MapboxGL from '@react-native-mapbox-gl/maps';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

/**
 * Deciding the camera focus mode. The camera focus mode also returns the values
 * which the camera should focus on, like the coordinates, stop place or map
 * lines.
 *
 * Why is there a split between the "decide camera focus" and "trigger camera
 * move" hooks? This is both for simplifying the code a bit, since it was pretty
 * long and hard to read before it was split up. In addition, we need to return
 * the map lines back from the hook so the Map-component can draw them.
 */
export const useDecideCameraFocusMode = (
  selectionMode: MapSelectionMode,
  fromCoords: Coordinates | undefined,
  mapSelectionAction: MapSelectionActionType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusModeType>();
  useEffect(() => {
    (async function () {
      if (!mapSelectionAction) {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'my-position') {
        setCameraFocusMode({
          mode: 'my-position',
          coordinates: mapSelectionAction.coords,
        });
        return;
      }

      switch (selectionMode) {
        case 'ExploreLocation': {
          setCameraFocusMode({
            mode: 'coordinates',
            coordinates: mapPositionToCoordinates(
              mapSelectionAction.feature.geometry.coordinates,
            ),
          });
          break;
        }
        case 'ExploreStops': {
          const stopPlaceFeature = await findStopPlaceAtClick(
            mapSelectionAction.feature,
            mapViewRef,
          );
          const mapLines = await fetchMapLines(fromCoords, stopPlaceFeature);
          if (mapLines) {
            setCameraFocusMode({mode: 'map-lines', mapLines});
          } else if (stopPlaceFeature) {
            setCameraFocusMode({mode: 'stop-place', stopPlaceFeature});
          } else {
            setCameraFocusMode(undefined);
          }
        }
      }
    })();
  }, [mapSelectionAction]);
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
