import {
  FeatureOrCoordinates,
  MapSelectionMode,
} from '@atb/components/map/types';
import {RefObject, useEffect, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {findClickedStopPlace, isCoordinates} from '@atb/components/map/utils';
import {Feature, Point} from 'geojson';

/**
 * Find the selected stop place based on the selected coordinates. Will only try
 * to find clicked stop place if the selection mode is "ExploreStops", and the
 * provided featureOrCoords is a feature and not coordinates. The latter rule is
 * there because if the featureOrCoords is off type coordinates then they are
 * provided by location arrow click, and we should not find stop places which
 * coincidentally is located under the users location arrow.
 */
export const useFindSelectedStopPlace = (
  selectionMode: MapSelectionMode,
  featureOrCoords: FeatureOrCoordinates | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const [stopPlaceFeature, setStopPlaceFeature] = useState<Feature<Point>>();
  useEffect(() => {
    (async function () {
      const shouldFindStopPlace =
        featureOrCoords &&
        !isCoordinates(featureOrCoords) &&
        selectionMode === 'ExploreStops';
      if (shouldFindStopPlace) {
        const stopPlace = await findClickedStopPlace(
          featureOrCoords,
          mapViewRef,
        );
        setStopPlaceFeature(stopPlace);
      }
    })();
  }, [featureOrCoords]);
  return stopPlaceFeature;
};
