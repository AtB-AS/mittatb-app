import {Feature, Point} from 'geojson';
import {DeparturesDialogSheet} from '../../../map/components/DeparturesDialogSheet';
import React from 'react';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import type {MapPluginType} from '@atb/components/map_v2/plugins/types.ts';
import {isStopPlace} from "@atb/components/map/utils.ts";

export const useStopPlacePlugin: MapPluginType = (_) => {
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  return {
    handlePress: (features: Feature<Point>[]): boolean => {
      // if (!enabled) return true;

      const stopPlaceFeature = features.find(isStopPlace);
      if (stopPlaceFeature) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              onClose={closeBottomSheet}
              distance={200}
              stopPlaceFeature={stopPlaceFeature}
              navigateToDetails={closeBottomSheet}
              navigateToQuay={closeBottomSheet}
              navigateToTripSearch={closeBottomSheet}
            />
          ),
          false,
        );
        return false;
      }

      return true;
    },
    renderedFeature: undefined,
  };
};
