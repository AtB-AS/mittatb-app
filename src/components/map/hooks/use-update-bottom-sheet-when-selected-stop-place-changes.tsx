import {FeatureOrCoordinates, MapProps} from '@atb/components/map/types';
import React, {RefObject, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import DeparturesDialogSheet from '@atb/components/map/components/DeparturesDialogSheet';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, Point} from 'geojson';
import {findClickedStopPlace, isCoordinates} from '@atb/components/map/utils';

/**
 * Open or close the bottom sheet based on the selected coordinates. Will also
 * close the bottom sheet when navigating to other places, but it will be
 * reopened when the `isFocused` value becomes `true`.
 */
export const useUpdateBottomSheetWhenSelectedStopPlaceChanges = (
  mapProps: MapProps,
  featureOrCoords: FeatureOrCoordinates | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
  closeCallback: () => void,
) => {
  const isFocused = useIsFocused();
  const [stopPlaceFeature, setStopPlaceFeature] = useState<Feature<Point>>();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const closeWithCallback = () => {
    closeBottomSheet();
    closeCallback();
  };

  useEffect(() => {
    (async function () {
      const stopPlace =
        featureOrCoords && !isCoordinates(featureOrCoords)
          ? await findClickedStopPlace(featureOrCoords, mapViewRef)
          : undefined;
      setStopPlaceFeature(stopPlace);
    })();
  }, [featureOrCoords]);

  useEffect(() => {
    (async function () {
      if (!isFocused) return;
      if (mapProps.selectionMode !== 'ExploreStops') return;

      if (stopPlaceFeature) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              close={closeWithCallback}
              place={{
                id: stopPlaceFeature.properties?.id,
                name: stopPlaceFeature.properties?.name,
              }}
              navigateToDetails={(...params) => {
                closeBottomSheet();
                mapProps.navigateToDetails(...params);
              }}
              navigateToQuay={(...params) => {
                closeBottomSheet();
                mapProps.navigateToQuay(...params);
              }}
            />
          ),
          undefined,
          false,
        );
      } else {
        closeBottomSheet();
      }
    })();
  }, [stopPlaceFeature, isFocused]);
};
