import {
  MapFilterType,
  MapProps,
  MapSelectionActionType,
  ParkingType,
} from '../types';
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
  ParkAndRideBottomSheet,
  isScooter,
} from '@atb/modules/mobility';
import {useMapSelectionAnalytics} from './use-map-selection-analytics';
import {BicycleSheet} from '@atb/modules/mobility';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {ExternalRealtimeMapSheet} from '../components/external-realtime-map/ExternalRealtimeMapSheet';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {MapFilterSheet} from '@atb/modules/mobility';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
//import {SelectShmoPaymentMethodSheet} from '@atb/modules/mobility';
//import {useEnterPaymentMethods} from './use-enter-payment-methods';
import {AutoSelectableBottomSheetType, useMapContext} from '../MapContext';

/**
 * Open or close the bottom sheet based on the selected coordinates. Will also
 * close the bottom sheet when navigating to other places, but it will be
 * reopened when the `isFocused` value becomes `true`.
 */
export const useUpdateBottomSheetWhenSelectedEntityChanges = (
  mapProps: MapProps,
  distance: number | undefined,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  closeCallback: () => void,
  tabBarHeight?: number,
  mapSelectionAction?: MapSelectionActionType | undefined,
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
  /*const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();*/
  const {enable_vipps_login} = useRemoteConfigContext();
  //const navigateToPaymentMethods = useEnterPaymentMethods();
  const {setMapFilterIsOpen, mapSelectionDispatch, mapSelectionState} =
    useMapContext();

  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const closeWithCallback = useCallback(() => {
    closeBottomSheet();
    closeCallback();
  }, [closeBottomSheet, closeCallback]);

  const onReportParkingViolation = useCallback(() => {
    closeWithCallback();
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [closeWithCallback, analytics, navigation]);

  const allVersionFeature = isMapV2Enabled
    ? mapSelectionState.feature
    : selectedFeature;

  useEffect(() => {
    (async function () {
      closeBottomSheet();
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
  }, [
    mapSelectionAction,
    analytics,
    mapViewRef,
    mapSelectionDispatch,
    closeBottomSheet,
  ]);

  useEffect(() => {
    (async function () {
      if (!isFocused) return;

      if (
        isMapV2Enabled
          ? mapSelectionState.mapState === 'FILTER'
          : mapSelectionAction?.source === 'filters-button'
      ) {
        setMapFilterIsOpen(true);
        openBottomSheet(
          () => (
            <MapFilterSheet
              onFilterChanged={(filter: MapFilterType) => {
                analytics.logEvent('Map', 'Filter changed', {filter});
                mapProps.vehicles?.onFilterChange(filter.mobility);
                mapProps.stations?.onFilterChange(filter.mobility);
              }}
              onClose={() => {
                closeCallback();
                setMapFilterIsOpen(false);
              }}
            />
          ),
          onCloseFocusRef,
          true,
          0,
        );
        return;
      }

      if (
        isMapV2Enabled
          ? mapSelectionState.mapState === 'EXTERNAL_MAP'
          : mapSelectionAction?.source === 'external-map-button'
      ) {
        openBottomSheet(
          () => (
            <ExternalRealtimeMapSheet
              onClose={closeCallback}
              url={
                isMapV2Enabled
                  ? mapSelectionState.url!
                  : mapSelectionAction?.source === 'external-map-button'
                  ? mapSelectionAction.url
                  : ''
              }
            />
          ),
          onCloseFocusRef,
          true,
          tabBarHeight,
        );
        return;
      }

      if (!allVersionFeature) {
        closeBottomSheet();
        return;
      }
      if (
        isMapV2Enabled
          ? mapSelectionState?.mapState === 'STOP_PLACE'
          : isStopPlace(allVersionFeature)
      ) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              onClose={closeCallback}
              distance={distance}
              stopPlaceFeature={allVersionFeature}
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
          tabBarHeight,
        );
      } else if (
        isMapV2Enabled
          ? mapSelectionState.mapState ===
            AutoSelectableBottomSheetType.BikeStation
          : isBikeStation(allVersionFeature)
      ) {
        openBottomSheet(
          () => (
            <BikeStationBottomSheet
              stationId={allVersionFeature.properties?.id}
              distance={distance}
              onClose={closeCallback}
            />
          ),
          onCloseFocusRef,
          false,
          tabBarHeight,
        );
      } else if (
        isMapV2Enabled
          ? mapSelectionState.mapState ===
            AutoSelectableBottomSheetType.CarStation
          : isCarStation(allVersionFeature)
      ) {
        openBottomSheet(
          () => (
            <CarSharingStationBottomSheet
              stationId={allVersionFeature.properties?.id}
              distance={distance}
              onClose={closeCallback}
            />
          ),
          onCloseFocusRef,
          false,
          tabBarHeight,
        );
      } else if (!isMapV2Enabled && isScooter(allVersionFeature)) {
        //HANDLE MAPV1
      } else if (
        isMapV2Enabled
          ? mapSelectionState.mapState === AutoSelectableBottomSheetType.Bicycle
          : isBicycle(allVersionFeature)
      ) {
        console.log('OPENING SHEETByCICLE');
        openBottomSheet(
          () => {
            return (
              <BicycleSheet
                vehicleId={allVersionFeature.properties?.id as string}
                onClose={closeCallback}
              />
            );
          },
          onCloseFocusRef,
          false,
          tabBarHeight,
        );
      } else if (
        isMapV2Enabled
          ? mapSelectionState.mapState === 'PARK_AND_RIDE'
          : isParkAndRide(allVersionFeature)
      ) {
        openBottomSheet(
          () => {
            return (
              allVersionFeature && (
                <ParkAndRideBottomSheet
                  name={allVersionFeature.properties?.name}
                  capacity={allVersionFeature.properties?.totalCapacity}
                  parkingFor={allVersionFeature.properties?.parkingVehicleTypes}
                  feature={allVersionFeature as Feature<Point, ParkingType>}
                  distance={distance}
                  onClose={closeCallback}
                  navigateToTripSearch={(...params) => {
                    closeBottomSheet();
                    mapProps.navigateToTripSearch(...params);
                  }}
                />
              )
            );
          },
          onCloseFocusRef,
          false,
          tabBarHeight,
        );
      } else {
        closeBottomSheet();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVersionFeature, isFocused, distance, analytics, enable_vipps_login]);

  // still returning for mapv1
  return {
    selectedFeature: allVersionFeature,
    onReportParkingViolation,
  };
};
