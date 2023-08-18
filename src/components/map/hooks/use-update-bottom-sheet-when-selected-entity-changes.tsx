import {MapProps, MapSelectionActionType} from '../types';
import React, {RefObject, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {DeparturesDialogSheet} from '../components/DeparturesDialogSheet';
import MapboxGL from '@rnmapbox/maps';
import {Feature, Point} from 'geojson';
import {findEntityAtClick, isParkAndRide, isStopPlace} from '../utils';
import {
  BikeStationSheet,
  CarSharingStationSheet,
  isBicycle,
  isBikeStation,
  isCarStation,
  isScooter,
  ParkAndRideBottomSheet,
  ScooterSheet,
} from '@atb/mobility';
import {useMapSelectionAnalytics} from './use-map-selection-analytics';
import {BicycleSheet} from '@atb/mobility/components/BicycleSheet';

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
  const analytics = useMapSelectionAnalytics();

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
      if (selectedFeature) {
        analytics.logMapSelection(selectedFeature);
      }
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
          false,
        );
      } else if (isBikeStation(selectedFeature)) {
        openBottomSheet(
          () => (
            <BikeStationSheet
              stationId={selectedFeature.properties.id}
              distance={distance}
              close={closeWithCallback}
            />
          ),
          false,
        );
      } else if (isCarStation(selectedFeature)) {
        openBottomSheet(
          () => (
            <CarSharingStationSheet
              stationId={selectedFeature.properties.id}
              distance={distance}
              close={closeWithCallback}
            />
          ),
          false,
        );
      } else if (isScooter(selectedFeature)) {
        openBottomSheet(() => {
          return (
            <ScooterSheet
              vehicleId={selectedFeature.properties.id}
              close={closeWithCallback}
            />
          );
        }, false);
      } else if (isBicycle(selectedFeature)) {
        openBottomSheet(() => {
          return (
            <BicycleSheet
              vehicleId={selectedFeature.properties.id}
              close={closeWithCallback}
            />
          );
        }, false);
      } else if (isParkAndRide(selectedFeature)) {
        openBottomSheet(() => {
          return (
            <ParkAndRideBottomSheet
              name={selectedFeature.properties.name}
              capacity={selectedFeature.properties.totalCapacity}
              parkingFor={selectedFeature.properties.parkingVehicleTypes}
              feature={selectedFeature}
              distance={distance}
              close={closeWithCallback}
              navigateToTripSearch={(...params) => {
                closeBottomSheet();
                mapProps.navigateToTripSearch(...params);
              }}
            />
          );
        }, false);
      } else {
        closeBottomSheet();
      }
    })();
  }, [selectedFeature, isFocused, distance, analytics]);
};
