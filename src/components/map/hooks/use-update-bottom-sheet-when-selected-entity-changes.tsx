import {MapProps, MapSelectionActionType} from '../types';
import React, {RefObject, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {DeparturesDialogSheet} from '../components/DeparturesDialogSheet';
import MapboxGL from '@rnmapbox/maps';
import {Feature, Point} from 'geojson';
import {findEntityAtClick, isStopPlace} from '../utils';
import {isBikeStation, isVehicle} from '@atb/mobility/utils';
import {CityBikeStationSheet} from '@atb/mobility/components/CityBikeStationBottomSheet';
import {ScooterSheet} from '@atb/mobility/components/ScooterSheet';

/**
 * Open or close the bottom sheet based on the selected coordinates. Will also
 * close the bottom sheet when navigating to other places, but it will be
 * reopened when the `isFocused` value becomes `true`.
 */
export const useUpdateBottomSheetWhenSelectedEntityChanges = (
  mapProps: MapProps,
  distance: number | undefined,
  mapSelectionAction: MapSelectionActionType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
  closeCallback: () => void,
) => {
  const isFocused = useIsFocused();
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const closeWithCallback = () => {
    closeBottomSheet();
    closeCallback();
  };

  useEffect(() => {
    (async function () {
      const selectedFeature =
        mapSelectionAction?.source === 'map-click'
          ? await findEntityAtClick(mapSelectionAction.feature, mapViewRef)
          : undefined;
      setSelectedFeature(selectedFeature);
    })();
  }, [mapSelectionAction]);

  useEffect(() => {
    (async function () {
      if (!isFocused) return;
      if (mapProps.selectionMode !== 'ExploreEntities') return;
      if (!selectedFeature) {
        closeBottomSheet();
        return;
      }
      if (isStopPlace(selectedFeature)) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              close={closeWithCallback}
              distance={distance}
              stopPlaceFeature={selectedFeature}
              navigateToDetails={(...params) => {
                closeBottomSheet();
                mapProps.navigateToDetails(...params);
              }}
              navigateToQuay={(...params) => {
                closeBottomSheet();
                mapProps.navigateToQuay(...params);
              }}
              navigateToTripSearch={(...params) => {
                closeBottomSheet();
                mapProps.navigateToTripSearch(...params);
              }}
            />
          ),
          undefined,
          false,
        );
      } else if (isBikeStation(selectedFeature)) {
        openBottomSheet(
          () => (
            <CityBikeStationSheet
              stationId={selectedFeature.properties.id}
              distance={distance}
              close={closeWithCallback}
            />
          ),
          undefined,
          false,
        );
      } else if (isVehicle(selectedFeature)) {
        openBottomSheet(
          () => {
            return (
              <ScooterSheet
                vehicleId={selectedFeature.properties?.id}
                close={closeWithCallback}
              />
            );
          },
          undefined,
          false,
        );
      } else {
        closeBottomSheet();
      }
    })();
  }, [selectedFeature, isFocused, distance]);
};
