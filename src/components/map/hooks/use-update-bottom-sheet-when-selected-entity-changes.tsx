import {MapFilterType, MapProps, MapSelectionActionType} from '../types';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {DeparturesDialogSheet} from '../components/DeparturesDialogSheet';
import MapboxGL from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import {findEntityAtClick, isParkAndRide, isStopPlace} from '../utils';
import {
  BikeStationBottomSheet,
  CarSharingStationBottomSheet,
  isBicycle,
  isBikeStation,
  isCarStation,
  isScooter,
  ParkAndRideBottomSheet,
  ScooterSheet,
  isScooterV2,
  isBicycleV2,
  isBikeStationV2,
  isCarStationV2,
} from '@atb/mobility';
import {useMapSelectionAnalytics} from './use-map-selection-analytics';
import {BicycleSheet} from '@atb/mobility/components/BicycleSheet';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {ExternalRealtimeMapSheet} from '../components/external-realtime-map/ExternalRealtimeMapSheet';
import {useHasReservationOrAvailableFareContract} from '@atb/ticketing';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {MapFilterSheet} from '@atb/mobility/components/filter/MapFilterSheet';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useBottomSheetV2} from '@atb/components/bottom-sheet-v2';

/**
 * Open or close the bottom sheet based on the selected coordinates. Will also
 * close the bottom sheet when navigating to other places, but it will be
 * reopened when the `isFocused` value becomes `true`.
 */
export const useUpdateBottomSheetWhenSelectedEntityChanges = (
  mapProps: MapProps,
  distance: number | undefined,
  mapSelectionAction: MapSelectionActionType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  closeCallback: () => void,
): {
  selectedFeature: Feature<Point, GeoJsonProperties> | undefined;
  onReportParkingViolation: () => void;
} => {
  const {isMapV2Enabled} = useFeatureTogglesContext();

  const isFocused = useIsFocused();
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();
  const analytics = useMapSelectionAnalytics();
  const navigation = useNavigation<RootNavigationProps>();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const {enable_vipps_login} = useRemoteConfigContext();

  const {
    setContent,
    snapToIndex,
    close: closeV2,
    setOnClose,
  } = useBottomSheetV2();

  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const closeWithCallback = useCallback(() => {
    closeBottomSheet();
    closeCallback();
  }, [closeBottomSheet, closeCallback]);

  const switchBottomSheetOnClose = useCallback(() => {
    setOnClose(null);
    closeV2();
  }, [closeV2, setOnClose]);

  const onReportParkingViolation = useCallback(() => {
    closeWithCallback();
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [closeWithCallback, analytics, navigation]);

  useEffect(() => {
    (async function () {
      const selectedFeature =
        mapSelectionAction?.source === 'map-item'
          ? mapSelectionAction.feature
          : mapSelectionAction?.source === 'map-click'
          ? await findEntityAtClick(mapSelectionAction.feature, mapViewRef)
          : undefined;

      setSelectedFeature(selectedFeature);
      if (selectedFeature) {
        analytics.logMapSelection(selectedFeature);
      }
    })();
  }, [mapSelectionAction, analytics, mapViewRef]);

  useEffect(() => {
    (async function () {
      if (!isFocused) return;

      if (mapSelectionAction?.source === 'filters-button') {
        openBottomSheet(
          () => (
            <MapFilterSheet
              onFilterChanged={(filter: MapFilterType) => {
                analytics.logEvent('Map', 'Filter changed', {filter});
                mapProps.vehicles?.onFilterChange(filter.mobility);
                mapProps.stations?.onFilterChange(filter.mobility);
              }}
              onClose={closeCallback}
            />
          ),
          onCloseFocusRef,
        );
        console.log('closeV21');
        switchBottomSheetOnClose();
        return;
      }

      if (mapSelectionAction?.source === 'external-map-button') {
        openBottomSheet(
          () => (
            <ExternalRealtimeMapSheet
              onClose={closeCallback}
              url={mapSelectionAction.url}
            />
          ),
          onCloseFocusRef,
        );
        console.log('closeV22');
        switchBottomSheetOnClose();
        return;
      }

      if (!selectedFeature) {
        closeBottomSheet();
        console.log('no selected feature close');
        switchBottomSheetOnClose();
        return;
      }
      if (isStopPlace(selectedFeature)) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              onClose={closeCallback}
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
          onCloseFocusRef,
          false,
        );
        console.log('closeV24');
        switchBottomSheetOnClose();
      } else if (
        isMapV2Enabled
          ? isBikeStationV2(selectedFeature)
          : isBikeStation(selectedFeature)
      ) {
        openBottomSheet(
          () => (
            <BikeStationBottomSheet
              stationId={selectedFeature?.properties?.id}
              distance={distance}
              onClose={closeCallback}
            />
          ),
          onCloseFocusRef,
          false,
        );
        console.log('closeV25');
        switchBottomSheetOnClose();
      } else if (
        isMapV2Enabled
          ? isCarStationV2(selectedFeature)
          : isCarStation(selectedFeature)
      ) {
        openBottomSheet(
          () => (
            <CarSharingStationBottomSheet
              stationId={selectedFeature?.properties?.id}
              distance={distance}
              onClose={closeCallback}
            />
          ),
          onCloseFocusRef,
          false,
        );
        console.log('closeV26');
        switchBottomSheetOnClose();
      } else if (
        isMapV2Enabled
          ? isScooterV2(selectedFeature)
          : isScooter(selectedFeature)
      ) {
        setContent(
          <ScooterSheet
            vehicleId={selectedFeature?.properties?.id}
            onReportParkingViolation={onReportParkingViolation}
            navigateSupportCallback={() => {
              console.log('navigateSupportCallback');
              closeV2();
              navigation.navigate('Root_ScooterHelpScreen', {
                vehicleId: selectedFeature?.properties?.id,
              });
            }}
            loginCallback={() => {
              console.log('logincallback');
              closeV2();
              if (hasReservationOrAvailableFareContract) {
                navigation.navigate(
                  'Root_LoginAvailableFareContractWarningScreen',
                  {},
                );
              } else if (enable_vipps_login) {
                navigation.navigate('Root_LoginOptionsScreen', {
                  showGoBack: true,
                  transitionOverride: 'slide-from-bottom',
                });
              } else {
                navigation.navigate('Root_LoginPhoneInputScreen', {});
              }
            }}
            startOnboardingCallback={() => {
              console.log('startOnboardingCallback');
              closeV2();
              navigation.navigate('Root_ShmoOnboardingScreen');
            }}
          />,
        );
        console.log('opening scooter sheet');
        setOnClose(() => {
          closeCallback();
        });
        snapToIndex(1);
        closeBottomSheet();
      } else if (
        isMapV2Enabled
          ? isBicycleV2(selectedFeature)
          : isBicycle(selectedFeature)
      ) {
        openBottomSheet(
          () => {
            return (
              <BicycleSheet
                vehicleId={selectedFeature?.properties?.id}
                onClose={closeCallback}
              />
            );
          },
          onCloseFocusRef,
          false,
        );
        console.log('closeV27');
        switchBottomSheetOnClose();
      } else if (isParkAndRide(selectedFeature)) {
        openBottomSheet(
          () => {
            return (
              <ParkAndRideBottomSheet
                name={selectedFeature.properties.name}
                capacity={selectedFeature.properties.totalCapacity}
                parkingFor={selectedFeature.properties.parkingVehicleTypes}
                feature={selectedFeature}
                distance={distance}
                onClose={closeCallback}
                navigateToTripSearch={(...params) => {
                  closeBottomSheet();
                  mapProps.navigateToTripSearch(...params);
                }}
              />
            );
          },
          onCloseFocusRef,
          false,
        );
        console.log('closeV2Last');
        switchBottomSheetOnClose();
      } else {
        closeBottomSheet();
      }
    })();
  }, [
    mapSelectionAction,
    selectedFeature,
    isFocused,
    distance,
    analytics,
    enable_vipps_login,
    hasReservationOrAvailableFareContract,
    snapToIndex,
    setContent,
    closeCallback,
    closeBottomSheet,
    openBottomSheet,
    navigation,
    isMapV2Enabled,
    mapProps,
    onReportParkingViolation,
    closeV2,
    setOnClose,
    switchBottomSheetOnClose,
  ]);

  return {selectedFeature, onReportParkingViolation};
};
