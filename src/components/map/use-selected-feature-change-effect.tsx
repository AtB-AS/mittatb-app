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

type FeatureOrCoordinates = Feature<Point> | Coordinates;

const useSelectedFeatureChangeEffect = (
  selectionMode: MapSelectionMode,
  startingCoordinates: Coordinates | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();
  const [featureOrCoordinates, setFeatureOrCoordinates] = useState<
    FeatureOrCoordinates | undefined
  >(startingCoordinates);
  const {location: currentLocation} = useGeolocationState();
  const [fromCoordinates, setFromCoordinates] = useState(
    currentLocation?.coordinates,
  );

  const onClick = (fc: FeatureOrCoordinates) => {
    setFeatureOrCoordinates(fc);
    setFromCoordinates(currentLocation?.coordinates);
  };

  useEffect(() => {
    (async function () {
      if (!featureOrCoordinates) {
        setMapLines(undefined);
        return;
      }
      const selectedCoordinates =
        getCoordinatesFromFeatureOrCoordinates(featureOrCoordinates);

      switch (selectionMode) {
        case 'ExploreLocation': {
          flyToLocation(selectedCoordinates, 750, mapCameraRef);
          break;
        }
        case 'ExploreStops': {
          if (isCoordinates(featureOrCoordinates)) return;

          const stopPlaceFeature = await findClickedStopPlace(
            featureOrCoordinates,
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
  }, [fromCoordinates, featureOrCoordinates]);

  return {
    mapLines,
    onClick,
    selectedCoordinates: featureOrCoordinates
      ? getCoordinatesFromFeatureOrCoordinates(featureOrCoordinates)
      : undefined,
  };
};

const isCoordinates = (foc: FeatureOrCoordinates): foc is Coordinates =>
  'latitude' in foc;

const getCoordinatesFromFeatureOrCoordinates = (foc: FeatureOrCoordinates) =>
  'latitude' in foc ? foc : mapPositionToCoordinates(foc.geometry.coordinates);

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
