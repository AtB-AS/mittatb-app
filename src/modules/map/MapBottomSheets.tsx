import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  ActiveScooterSheet,
  BicycleSheet,
  BikeStationBottomSheet,
  CarSharingStationBottomSheet,
  FinishedScooterSheet,
  FinishingScooterSheet,
  MapFilterSheet,
  ParkAndRideBottomSheet,
  ScooterSheet,
  SelectShmoPaymentMethodSheet,
  useActiveShmoBookingQuery,
} from '@atb/modules/mobility';

import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useNavigation} from '@react-navigation/native';
import React, {RefObject, useCallback, useEffect, useState} from 'react';
import {useEnterPaymentMethods} from './hooks/use-enter-payment-methods';
import {
  flyToLocation,
  getFeatureFromScan,
  isParkAndRide,
  mapPositionToCoordinates,
  CUSTOM_SCAN_ZOOM_LEVEL,
} from './utils';
import MapboxGL from '@rnmapbox/maps';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {MapFilterType, MapProps} from './types';
import {ExternalRealtimeMapSheet} from './components/external-realtime-map/ExternalRealtimeMapSheet';
import {DeparturesDialogSheet} from './components/DeparturesDialogSheet';

import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSelectionAnalytics} from './hooks/use-map-selection-analytics';
import {MapStateActionType} from './mapStateReducer';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {getSlightlyRaisedMapPadding} from './MapConfig';
import {MapBottomSheetType, useMapContext} from './MapContext';

type MapBottomSheetsProps = {
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  mapProps: MapProps;
  locationArrowOnPress: () => void;
};

export const MapBottomSheets = ({
  mapCameraRef,
  mapViewRef,
  mapProps,
  locationArrowOnPress,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const navigateToPaymentMethods = useEnterPaymentMethods();
  const {mapState, dispatchMapState, paddingBottomMap} = useMapContext();
  const {data: activeBooking} = useActiveShmoBookingQuery();
  const tabBarHeight = useBottomTabBarHeight();

  const analytics = useAnalyticsContext();
  const mapAnalytics = useMapSelectionAnalytics();
  const navigation = useNavigation<RootNavigationProps>();

  const onReportParkingViolation = useCallback(() => {
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [analytics, navigation]);

  useEffect(() => {
    if (mapState.feature && paddingBottomMap > 0) {
      flyToLocation({
        coordinates: mapPositionToCoordinates(
          mapState.feature.geometry.coordinates,
        ),
        padding: getSlightlyRaisedMapPadding(paddingBottomMap),
        mapCameraRef,
        mapViewRef,
        animationMode: 'easeTo',
        zoomLevel: mapState?.customZoomLevel,
      });
    }
  }, [
    mapCameraRef,
    mapState?.customZoomLevel,
    mapState.feature,
    mapViewRef,
    paddingBottomMap,
  ]);

  async function selectPaymentMethod() {
    setOpenPaymentType(true);
  }

  const handleCloseSheet = useCallback(() => {
    dispatchMapState({type: MapStateActionType.None});
  }, [dispatchMapState]);

  useEffect(() => {
    if (mapState.feature) {
      mapAnalytics.logMapSelection(mapState.feature);
    }
  }, [mapAnalytics, mapState.feature, mapState.bottomSheetType]);

  return (
    <>
      {mapState.bottomSheetType === MapBottomSheetType.Scooter &&
        !openPaymentType &&
        !activeBooking?.bookingId && (
          <ScooterSheet
            onVehicleReceived={(item) => {
              if (mapState.assetIsScanned) {
                const feature: Feature<Point, GeoJsonProperties> =
                  getFeatureFromScan(item, mapState.bottomSheetType);
                dispatchMapState({
                  type: MapStateActionType.Scooter,
                  feature: feature,
                  customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
                });
              }
            }}
            selectPaymentMethod={selectPaymentMethod}
            vehicleId={
              mapState.feature?.properties?.id ?? mapState.assetId ?? ''
            }
            onClose={handleCloseSheet}
            onReportParkingViolation={onReportParkingViolation}
            navigation={navigation}
            startOnboardingCallback={() => {
              navigation.navigate('Root_ShmoOnboardingScreen');
            }}
            locationArrowOnPress={locationArrowOnPress}
          />
        )}

      {openPaymentType && (
        <SelectShmoPaymentMethodSheet
          onSelect={() => {
            setOpenPaymentType(false);
          }}
          onClose={() => {
            setOpenPaymentType(false);
          }}
          onGoToPaymentPage={() => {
            setOpenPaymentType(false);
            navigateToPaymentMethods();
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}

      {activeBooking?.state === ShmoBookingState.IN_USE && (
        <ActiveScooterSheet
          mapViewRef={mapViewRef}
          onForceClose={handleCloseSheet}
          navigateSupportCallback={() => {
            navigation.navigate('Root_ScooterHelpScreen', {
              operatorId: activeBooking.asset.operator.id,
              bookingId: activeBooking.bookingId,
            });
          }}
          photoNavigation={() => {
            handleCloseSheet();
            navigation.navigate('Root_ParkingPhotoScreen', {
              bookingId: activeBooking.bookingId,
            });
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}
      {activeBooking?.state === ShmoBookingState.FINISHING && (
        <FinishingScooterSheet
          onForceClose={handleCloseSheet}
          photoNavigation={() => {
            handleCloseSheet();
            navigation.navigate('Root_ParkingPhotoScreen', {
              bookingId: activeBooking.bookingId,
            });
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.FinishedBooking &&
        mapState?.bookingId !== undefined && (
          <FinishedScooterSheet
            bookingId={mapState.bookingId}
            onClose={handleCloseSheet}
            navigateSupportCallback={(operatorId, bookingId) => {
              handleCloseSheet();
              navigation.navigate('Root_ScooterHelpScreen', {
                operatorId,
                bookingId,
              });
            }}
            locationArrowOnPress={locationArrowOnPress}
          />
        )}
      {mapState.bottomSheetType === MapBottomSheetType.Bicycle && (
        <BicycleSheet
          vehicleId={mapState.feature?.properties?.id ?? mapState.assetId ?? ''}
          onClose={handleCloseSheet}
          onVehicleReceived={(item) => {
            if (mapState.assetIsScanned) {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan(item, mapState.bottomSheetType);

              dispatchMapState({
                type: MapStateActionType.Bicycle,
                feature: feature,
                customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
              });
            }
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}

      {mapState.bottomSheetType === MapBottomSheetType.BikeStation && (
        <BikeStationBottomSheet
          stationId={mapState.feature?.properties?.id ?? mapState.assetId ?? ''}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(item) => {
            if (mapState.assetIsScanned) {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan(item, mapState.bottomSheetType);

              dispatchMapState({
                type: MapStateActionType.BikeStation,
                feature: feature,
                customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
              });
            }
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.CarStation && (
        <CarSharingStationBottomSheet
          stationId={mapState.feature?.properties?.id ?? mapState.assetId ?? ''}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(item) => {
            if (mapState.assetIsScanned) {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan(item, mapState.bottomSheetType);

              dispatchMapState({
                type: MapStateActionType.CarStation,
                feature: feature,
                customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
              });
            }
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}

      {mapState.bottomSheetType === MapBottomSheetType.Filter && (
        <MapFilterSheet
          onFilterChanged={(filter: MapFilterType) => {
            analytics.logEvent('Map', 'Filter changed', {filter});
            mapProps.vehicles?.onFilterChange(filter.mobility);
            mapProps.stations?.onFilterChange(filter.mobility);
          }}
          onClose={() => {
            handleCloseSheet();
          }}
          locationArrowOnPress={locationArrowOnPress}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.ExternalMap &&
        mapState?.url !== undefined && (
          <ExternalRealtimeMapSheet
            onClose={handleCloseSheet}
            url={mapState.url}
            locationArrowOnPress={locationArrowOnPress}
          />
        )}
      {mapState?.bottomSheetType === MapBottomSheetType.StopPlace &&
        !!mapState.feature && (
          <DeparturesDialogSheet
            tabBarHeight={tabBarHeight}
            onClose={handleCloseSheet}
            distance={undefined}
            stopPlaceFeature={mapState.feature}
            navigateToDetails={(...params) => {
              mapProps.navigateToDetails(...params);
            }}
            navigateToQuay={(...params) => {
              mapProps.navigateToQuay(...params);
            }}
            navigateToTripSearch={(...params) => {
              mapProps.navigateToTripSearch(...params);
            }}
            locationArrowOnPress={locationArrowOnPress}
          />
        )}
      {mapState.bottomSheetType === MapBottomSheetType.ParkAndRideStation &&
        mapState?.feature !== undefined &&
        isParkAndRide(mapState.feature) && (
          <ParkAndRideBottomSheet
            name={mapState.feature?.properties?.name}
            capacity={mapState.feature?.properties?.totalCapacity}
            parkingFor={mapState.feature?.properties?.parkingVehicleTypes}
            feature={mapState.feature}
            distance={undefined}
            onClose={handleCloseSheet}
            navigateToTripSearch={(...params) => {
              handleCloseSheet();
              mapProps.navigateToTripSearch(...params);
            }}
            locationArrowOnPress={locationArrowOnPress}
          />
        )}
    </>
  );
};
