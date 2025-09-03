import {
  MapFilterType,
  MapProps,
  MapSelectionActionType,
  ParkingType,
} from '../types';
import React, {RefObject, useCallback, useEffect, useRef} from 'react';
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
  isBicycleV2,
  isBikeStationV2,
  isCarStationV2,
  isScooterV2,
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
  mapSelectionAction: MapSelectionActionType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  closeCallback: () => void,
  tabBarHeight?: number,
): {
  selectedFeature: Feature<Point, GeoJsonProperties> | undefined;
  onReportParkingViolation: () => void;
} => {
  const {isMapV2Enabled} = useFeatureTogglesContext();
  const isFocused = useIsFocused();
  //const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
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

  useEffect(() => {
    (async function () {
      closeBottomSheet();
      const selectedFeature =
        mapSelectionAction?.source === 'map-item'
          ? mapSelectionAction.feature
          : mapSelectionAction?.source === 'map-click'
          ? await findEntityAtClick(mapSelectionAction.feature, mapViewRef)
          : undefined;

      mapSelectionDispatch({
        mapState: 'MAP_SELECTION_ITEM',
        feature: selectedFeature,
      });

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

      if (mapSelectionAction?.source === 'filters-button') {
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

      if (mapSelectionAction?.source === 'external-map-button') {
        openBottomSheet(
          () => (
            <ExternalRealtimeMapSheet
              onClose={closeCallback}
              url={mapSelectionAction.url}
            />
          ),
          onCloseFocusRef,
          true,
          tabBarHeight,
        );
        return;
      }

      if (!mapSelectionState?.feature) {
        closeBottomSheet();
        return;
      }
      if (
        mapSelectionState?.feature &&
        isStopPlace(mapSelectionState.feature)
      ) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              onClose={closeCallback}
              distance={distance}
              stopPlaceFeature={mapSelectionState.feature!}
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
          ? isBikeStationV2(mapSelectionState.feature)
          : isBikeStation(mapSelectionState.feature)
      ) {
        openBottomSheet(
          () => (
            <BikeStationBottomSheet
              stationId={mapSelectionState.feature?.properties?.id}
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
          ? isCarStationV2(mapSelectionState.feature)
          : isCarStation(mapSelectionState.feature)
      ) {
        openBottomSheet(
          () => (
            <CarSharingStationBottomSheet
              stationId={mapSelectionState.feature?.properties?.id}
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
          ? isScooterV2(mapSelectionState.feature)
          : isScooter(mapSelectionState.feature)
      ) {
        mapSelectionDispatch({
          mapState: AutoSelectableBottomSheetType.Scooter,
          assetId: mapSelectionState.feature?.properties?.id,
          feature: mapSelectionState.feature,
        });
      } else if (
        isMapV2Enabled
          ? isBicycleV2(mapSelectionState.feature)
          : isBicycle(mapSelectionState.feature)
      ) {
        openBottomSheet(
          () => {
            return (
              <BicycleSheet
                vehicleId={mapSelectionState.feature?.properties?.id}
                onClose={closeCallback}
              />
            );
          },
          onCloseFocusRef,
          false,
          tabBarHeight,
        );
      } else if (
        mapSelectionState?.feature &&
        isParkAndRide(mapSelectionState.feature)
      ) {
        openBottomSheet(
          () => {
            return (
              mapSelectionState?.feature && (
                <ParkAndRideBottomSheet
                  name={mapSelectionState?.feature?.properties?.name}
                  capacity={
                    mapSelectionState?.feature?.properties?.totalCapacity
                  }
                  parkingFor={
                    mapSelectionState?.feature?.properties?.parkingVehicleTypes
                  }
                  feature={
                    mapSelectionState?.feature as Feature<Point, ParkingType>
                  }
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
  }, [
    mapSelectionState?.feature,
    isFocused,
    distance,
    analytics,
    enable_vipps_login,
  ]);

  // still returning for mapv1
  return {selectedFeature: mapSelectionState.feature, onReportParkingViolation};
};
