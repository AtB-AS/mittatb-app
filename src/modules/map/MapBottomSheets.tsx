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

import React, {RefObject, useCallback, useEffect, useState} from 'react';
import {
  getFeatureFromScan,
  isParkAndRide,
  CUSTOM_SCAN_ZOOM_LEVEL,
} from './utils';
import MapboxGL from '@rnmapbox/maps';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {MapFilterType, MapProps, ScooterHelpParams} from './types';
import {ExternalRealtimeMapSheet} from './components/external-realtime-map/ExternalRealtimeMapSheet';
import {DeparturesDialogSheet} from './components/DeparturesDialogSheet';

import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSelectionAnalytics} from './hooks/use-map-selection-analytics';
import {MapStateActionType} from './mapStateReducer';
import {MapBottomSheetType, useMapContext} from './MapContext';
import {useNavigateToNestedProfileScreen} from '@atb/utils/use-navigate-to-nested-profile-screen';

type MapBottomSheetsProps = {
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  mapProps: MapProps;
  locationArrowOnPress: () => void;
  tabBarHeight: number;
  navigateToScooterSupport: (params: ScooterHelpParams) => void;
  navigateToScooterOnboarding: () => void;
  navigateToReportParkingViolation: () => void;
  navigateToParkingPhoto: (bookingId: string) => void;
  navigateToScanQrCode: () => void;
  navigateToLogin: () => void;
};

export const MapBottomSheets = ({
  mapViewRef,
  mapProps,
  locationArrowOnPress,
  tabBarHeight,
  navigateToScooterSupport,
  navigateToScooterOnboarding,
  navigateToReportParkingViolation,
  navigateToParkingPhoto,
  navigateToScanQrCode,
  navigateToLogin,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const navigateToPaymentMethods = useNavigateToNestedProfileScreen(
    'Profile_PaymentMethodsScreen',
  );
  const {mapState, dispatchMapState} = useMapContext();
  const {data: activeBooking} = useActiveShmoBookingQuery();

  const analytics = useAnalyticsContext();
  const mapAnalytics = useMapSelectionAnalytics();

  const onReportParkingViolation = useCallback(() => {
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigateToReportParkingViolation();
  }, [analytics, navigateToReportParkingViolation]);

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
  }, [mapAnalytics, mapState.feature]);

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
            startOnboardingCallback={navigateToScooterOnboarding}
            navigateToSupport={navigateToScooterSupport}
            navigateToLogin={navigateToLogin}
            locationArrowOnPress={locationArrowOnPress}
            navigateToScanQrCode={navigateToScanQrCode}
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
          navigateToScanQrCode={navigateToScanQrCode}
        />
      )}

      {activeBooking?.state === ShmoBookingState.IN_USE && (
        <ActiveScooterSheet
          mapViewRef={mapViewRef}
          onForceClose={handleCloseSheet}
          navigateSupportCallback={() => {
            navigateToScooterSupport({
              operatorId: activeBooking.asset.operator.id,
              bookingId: activeBooking.bookingId,
            });
          }}
          photoNavigation={() => {
            handleCloseSheet();
            navigateToParkingPhoto(activeBooking.bookingId);
          }}
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
        />
      )}
      {activeBooking?.state === ShmoBookingState.FINISHING && (
        <FinishingScooterSheet
          onForceClose={handleCloseSheet}
          photoNavigation={() => {
            handleCloseSheet();
            navigateToParkingPhoto(activeBooking.bookingId);
          }}
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.FinishedBooking &&
        mapState?.bookingId !== undefined && (
          <FinishedScooterSheet
            bookingId={mapState.bookingId}
            onClose={handleCloseSheet}
            navigateSupportCallback={(operatorId, bookingId) => {
              handleCloseSheet();
              navigateToScooterSupport({
                operatorId,
                bookingId,
              });
            }}
            locationArrowOnPress={locationArrowOnPress}
            navigateToScanQrCode={navigateToScanQrCode}
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
          navigateToScanQrCode={navigateToScanQrCode}
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
          navigateToScanQrCode={navigateToScanQrCode}
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
          navigateToScanQrCode={navigateToScanQrCode}
        />
      )}

      {mapState.bottomSheetType === MapBottomSheetType.Filter && (
        <MapFilterSheet
          onFilterChanged={(filter: MapFilterType) => {
            analytics.logEvent('Map', 'Filter changed', {filter});
          }}
          onClose={() => {
            handleCloseSheet();
          }}
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.ExternalMap &&
        mapState?.url !== undefined && (
          <ExternalRealtimeMapSheet
            onClose={handleCloseSheet}
            url={mapState.url}
            locationArrowOnPress={locationArrowOnPress}
            navigateToScanQrCode={navigateToScanQrCode}
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
            navigateToScanQrCode={navigateToScanQrCode}
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
            navigateToScanQrCode={navigateToScanQrCode}
          />
        )}
    </>
  );
};
