import {
  CameraFocusModeType,
  MapLeg,
  MapSelectionActionType,
  MapSelectionMode,
} from '../types';
import {Coordinates} from '@atb/utils/coordinates';
import {RefObject, useEffect, useState} from 'react';
import {Feature, Point} from 'geojson';
import {createMapLines} from '@atb/travel-details-map-screen/utils';
import {
  findEntityAtClick,
  mapPositionToCoordinates,
  shouldShowMapLines,
  shouldZoomToFeature,
} from '../utils';
import {tripsSearch} from '@atb/api/trips';
import MapboxGL from '@rnmapbox/maps';
import {isLegFlexibleTransport} from '@atb/travel-details-screens/utils';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';

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

      if (mapSelectionAction.source === 'filters-button') {
        setCameraFocusMode(undefined);
        return;
      }

      if (mapSelectionAction.source === 'cluster-click') {
        setCameraFocusMode(undefined);
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
        case 'ExploreEntities': {
          const entityFeature = await findEntityAtClick(
            mapSelectionAction.feature,
            mapViewRef,
          );
          setCameraFocusMode(await getFocusMode(entityFeature, fromCoords));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const tripLegs: MapLeg[] = walkingTripPattern?.legs.map((leg) => {
      return {
        ...leg,
        mode: isLegFlexibleTransport(leg) ? 'flex' : leg.mode,
      };
    });
    const distance = walkingTripPattern.walkDistance;
    const mapLines = tripLegs ? createMapLines(tripLegs) : undefined;
    return {mapLines, distance};
  }
  return undefined;
};

const getFocusMode = async (
  entityFeature: Feature<Point> | undefined,
  fromCoords: Coordinates | undefined,
): Promise<CameraFocusModeType | undefined> => {
  if (!entityFeature) return undefined;
  if (shouldShowMapLines(entityFeature)) {
    const result = await fetchMapLines(fromCoords, entityFeature);
    if (result?.mapLines) {
      return {
        mode: 'map-lines',
        mapLines: result.mapLines,
        distance: result.distance,
      };
    }
  }
  return {
    mode: 'entity',
    entityFeature,
    zoomTo: shouldZoomToFeature(entityFeature),
  };
};
