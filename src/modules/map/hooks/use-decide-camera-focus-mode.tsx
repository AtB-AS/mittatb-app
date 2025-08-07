import {CameraFocusModeType, MapLeg, MapSelectionActionType} from '../types';
import {Coordinates} from '@atb/utils/coordinates';
import {RefObject, useEffect, useState} from 'react';
import {Feature, Point} from 'geojson';
import {createMapLines} from '@atb/screen-components/travel-details-map-screen';
import {
  findEntityAtClick,
  mapPositionToCoordinates,
  shouldShowMapLines,
  shouldZoomToFeature,
} from '../utils';
import {tripsSearch} from '@atb/api/bff/trips';
import MapboxGL from '@rnmapbox/maps';
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
  fromCoords: Coordinates | undefined,
  mapSelectionAction: MapSelectionActionType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  disableShouldShowMapLines?: boolean,
  disableShouldZoomToFeature?: boolean,
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

      if (mapSelectionAction.source === 'external-map-button') {
        setCameraFocusMode(undefined);
        return;
      }

      if (
        mapSelectionAction.source === 'cluster-click' ||
        mapSelectionAction.source === 'cluster-click-v2'
      ) {
        setCameraFocusMode(undefined);
        return;
      }

      const entityFeature = await findEntityAtClick(
        mapSelectionAction.feature,
        mapViewRef,
      );
      setCameraFocusMode(
        await getFocusMode(
          entityFeature,
          fromCoords,
          !!disableShouldShowMapLines,
          !!disableShouldZoomToFeature,
        ),
      );
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
    const tripLegs: MapLeg[] = walkingTripPattern?.legs;
    const distance = walkingTripPattern.walkDistance;
    const mapLines = tripLegs ? createMapLines(tripLegs) : undefined;
    return {mapLines, distance};
  }
  return undefined;
};

const getFocusMode = async (
  entityFeature: Feature<Point> | undefined,
  fromCoords: Coordinates | undefined,
  disableShouldShowMapLines: boolean,
  disableShouldZoomToFeature: boolean,
): Promise<CameraFocusModeType | undefined> => {
  if (!entityFeature) return undefined;
  if (!disableShouldShowMapLines && shouldShowMapLines(entityFeature)) {
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
    zoomTo: !disableShouldZoomToFeature && shouldZoomToFeature(entityFeature),
  };
};
