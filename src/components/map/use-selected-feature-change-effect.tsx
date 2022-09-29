import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {tripsSearch} from '@atb/api/trips_v2';
import {StreetMode} from '@entur/sdk/lib/journeyPlanner/types';
import {createMapLines, MapLine} from '@atb/screens/TripDetails/Map/utils';
import React, {RefObject, useEffect, useState} from 'react';
import {MapSelectionMode} from '../map/Map';
import {
  fitBounds,
  flyToLocation,
  isFeaturePoint,
  mapPositionToCoordinates,
} from '@atb/components/map/utils';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, Point} from 'geojson';
import {useGeolocationState} from '@atb/GeolocationContext';

const MAX_LIMIT_TO_SHOW_WALKING_TRIP = 5000;

const useSelectedFeatureChangeEffect = (
  fromCoordinates: Coordinates | undefined,
  selectedFeature: Feature<Point> | undefined,
  selectionMode: MapSelectionMode,
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();

  useEffect(() => {
    (async function () {
      console.log('SELECTED', selectedFeature);
      if (!selectedFeature) {
        setMapLines(undefined);
        return;
      }
      const selectedCoordinates = mapPositionToCoordinates(
        selectedFeature.geometry.coordinates,
      );

      switch (selectionMode) {
        case 'ExploreLocation': {
          flyToLocation(selectedCoordinates, 750, mapCameraRef);
          break;
        }
        case 'ExploreStops': {
          const stopPlaceFeature = await findClickedStopPlace(
            selectedFeature,
            mapViewRef,
          );

          if (stopPlaceFeature) {
            const stopPlaceCoordinates = mapPositionToCoordinates(
              stopPlaceFeature.geometry.coordinates,
            );
            if (fromCoordinates) {
              const mapLines = await getMapLines(
                fromCoordinates,
                stopPlaceCoordinates,
              );
              if (mapLines) {
                setMapLines(mapLines);
                fitBounds(fromCoordinates, stopPlaceCoordinates, mapCameraRef);
                return;
              }
            }
            flyToLocation(stopPlaceCoordinates, 750, mapCameraRef);
          }
          setMapLines(undefined);
        }
      }
    })();
  }, [fromCoordinates, selectedFeature]);

  return mapLines;
};

export default useSelectedFeatureChangeEffect;

const findClickedStopPlace = async (
  selectedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  if (!selectedFeature.properties) return;
  const {screenPointX, screenPointY} = selectedFeature.properties;
  if (!screenPointX || !screenPointY) return;
  const renderedFeaturesResult =
    await mapViewRef?.current?.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      ['==', ['geometry-type'], 'Point'],
    );
  return renderedFeaturesResult?.features
    .filter(isFeaturePoint)
    .find(
      (featureAtPoint) =>
        featureAtPoint?.properties?.entityType === 'StopPlace',
    );
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
