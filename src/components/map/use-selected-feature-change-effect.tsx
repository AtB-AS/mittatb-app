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
type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const useSelectedFeatureChangeEffect = (
  selectionMode: MapSelectionMode,
  startingSelectedCoordinates: Coordinates | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
  padding: MapboxGL.Padding = [100, 100],
) => {
  const [mapLines, setMapLines] = useState<MapLine[]>();
  const [selectedFeatureOrCoordinates, setSelectedFeatureOrCoordinates] =
    useState<FeatureOrCoordinates | undefined>(startingSelectedCoordinates);
  const {location: currentLocation} = useGeolocationState();
  const [fromCoordinates, setFromCoordinates] = useState(
    currentLocation?.coordinates,
  );

  const onMapClick = (fc: FeatureOrCoordinates) => {
    setSelectedFeatureOrCoordinates(fc);
    setFromCoordinates(currentLocation?.coordinates);
  };

  useEffect(() => {
    (async function () {
      if (!selectedFeatureOrCoordinates) {
        setMapLines(undefined);
        return;
      }
      const selectedCoordinates = getCoordinatesFromFeatureOrCoordinates(
        selectedFeatureOrCoordinates,
      );

      switch (selectionMode) {
        case 'ExploreLocation': {
          flyToLocation(selectedCoordinates, 750, mapCameraRef);
          break;
        }
        case 'ExploreStops': {
          if (isCoordinates(selectedFeatureOrCoordinates)) {
            flyToLocation(selectedCoordinates, 750, mapCameraRef);
            return;
          }
          const stopPlaceFeature = await findClickedStopPlace(
            selectedFeatureOrCoordinates,
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
                const bbox = getBoundingBox(mapLines);
                const northEast: Coordinates = {
                  longitude: bbox.xMin,
                  latitude: bbox.yMin,
                };
                const southWest: Coordinates = {
                  longitude: bbox.xMax,
                  latitude: bbox.yMax,
                };
                fitBounds(northEast, southWest, mapCameraRef, padding);
                return;
              }
            }
            flyToLocation(stopPlaceCoordinates, 750, mapCameraRef);
          }
          setMapLines(undefined);
        }
      }
    })();
  }, [fromCoordinates, selectedFeatureOrCoordinates]);

  return {
    mapLines,
    onMapClick,
    selectedCoordinates: selectedFeatureOrCoordinates
      ? getCoordinatesFromFeatureOrCoordinates(selectedFeatureOrCoordinates)
      : undefined,
  };
};

const isCoordinates = (foc: FeatureOrCoordinates): foc is Coordinates =>
  'latitude' in foc;

const getCoordinatesFromFeatureOrCoordinates = (foc: FeatureOrCoordinates) =>
  'latitude' in foc ? foc : mapPositionToCoordinates(foc.geometry.coordinates);

export default useSelectedFeatureChangeEffect;

export const findClickedStopPlace = async (
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

const getBoundingBox = (data: MapLine[]): BoundingBox => {
  var bounds: BoundingBox = {xMin: 180, xMax: 0, yMin: 90, yMax: 0};
  var coords, latitude, longitude;

  for (var i = 0; i < data.length; i++) {
    coords = data[i].geometry.coordinates;

    for (var j = 0; j < coords.length; j++) {
      longitude = coords[j][0];
      latitude = coords[j][1];
      bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
      bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
      bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
      bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
  }

  return bounds;
};
