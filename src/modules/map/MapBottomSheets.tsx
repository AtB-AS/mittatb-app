import {useAnalyticsContext} from '@atb/modules/analytics';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  ActiveShmoSheet,
  BikeStationBottomSheet,
  CarSharingStationBottomSheet,
  CityBikeStartTripOverlay,
  FinishedShmoSheet,
  FinishingScooterSheet,
  MapFilterSheet,
  ParkAndRideBottomSheet,
  VehicleSheet,
  SelectShmoPaymentMethodSheet,
  useActiveShmoBookingQuery,
} from '@atb/modules/mobility';

import React, {RefObject, useCallback, useEffect, useState} from 'react';
import {
  getFeatureFromScan,
  isParkAndRide,
  CUSTOM_SCAN_ZOOM_LEVEL,
  flyToLocation,
  mapPositionToCoordinates,
} from './utils';
import MapboxGL from '@rnmapbox/maps';
import {ShmoBookingState, ShmoPricingPlan} from '@atb/api/types/mobility';
import type {BenefitType} from '@atb/api/types/benefit';
import {MapFilterType, MapProps} from './types';
import {ExternalRealtimeMapSheet} from './components/external-realtime-map/ExternalRealtimeMapSheet';
import {DeparturesDialogSheet} from './components/DeparturesDialogSheet';

import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSelectionAnalytics} from './hooks/use-map-selection-analytics';
import {MapStateActionType} from './mapStateReducer';
import {getSlightlyRaisedMapPadding} from './MapConfig';
import {useWindowDimensions} from 'react-native';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {MapBottomSheetType, useMapContext} from './MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';

type MapBottomSheetsProps = {
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapProps: MapProps;
  locationArrowOnPress: () => void;
  tabBarHeight: number;
  navigateToShmoSupport: (params: ShmoHelpParams) => void;
  navigateToShmoOnboarding: (formFactor?: FormFactor) => void;
  navigateToReportParkingViolation: () => void;
  navigateToParkingPhoto: (bookingId: string) => void;
  navigateToScanQrCode: () => void;
  navigateToLogin: () => void;
  navigateToPaymentMethods: () => void;
  navigateToPricingDetails: (
    pricingPlan: ShmoPricingPlan,
    benefit: BenefitType | undefined,
  ) => void;
};

export const MapBottomSheets = ({
  mapViewRef,
  mapCameraRef,
  mapProps,
  locationArrowOnPress,
  tabBarHeight,
  navigateToShmoSupport,
  navigateToShmoOnboarding,
  navigateToReportParkingViolation,
  navigateToParkingPhoto,
  navigateToScanQrCode,
  navigateToLogin,
  navigateToPaymentMethods,
  navigateToPricingDetails,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const {
    mapState,
    dispatchMapState,
    setCurrentBottomSheet,
    currentBottomSheet,
  } = useMapContext();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {data: activeBooking} = useActiveShmoBookingQuery(isFocusedAndActive);
  const {bottomSheetMapRef} = useBottomSheetContext();

  const {height: screenHeight} = useWindowDimensions();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();

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

  const flyToWithPadding = useCallback(() => {
    if (mapState.feature) {
      flyToLocation({
        coordinates: mapPositionToCoordinates(
          mapState.feature.geometry.coordinates,
        ),
        padding: getSlightlyRaisedMapPadding(
          (screenHeight - tabBarMinHeight) * 0.7,
        ),
        mapCameraRef,
        mapViewRef,
        animationMode: 'easeTo',
        zoomLevel: mapState?.customZoomLevel,
      });
    }
  }, [
    mapState.feature,
    mapState?.customZoomLevel,
    screenHeight,
    tabBarMinHeight,
    mapCameraRef,
    mapViewRef,
  ]);

  useEffect(() => {
    if (mapState.feature) {
      mapAnalytics.logMapSelection(mapState.feature);
      flyToWithPadding();
      //if same sheet but different feature, expand sheet
      if (
        currentBottomSheet?.bottomSheetType === mapState.bottomSheetType &&
        currentBottomSheet?.feature?.properties?.id !==
          mapState.feature.properties?.id
      ) {
        bottomSheetMapRef.current?.expand();
        setCurrentBottomSheet({
          bottomSheetType: mapState.bottomSheetType,
          feature: mapState.feature,
        });
      }
    }
  }, [
    bottomSheetMapRef,
    currentBottomSheet?.bottomSheetType,
    currentBottomSheet?.feature?.properties?.id,
    flyToWithPadding,
    mapAnalytics,
    mapState.bottomSheetType,
    mapState.feature,
    setCurrentBottomSheet,
  ]);

  if (
    mapState.bottomSheetType === MapBottomSheetType.FinishedBooking &&
    mapState.bookingId
  ) {
    return (
      <FinishedShmoSheet
        bookingId={mapState.bookingId}
        onClose={handleCloseSheet}
        navigateSupportCallback={(operatorId, bookingId, formFactor) => {
          handleCloseSheet();
          navigateToShmoSupport({
            operatorId,
            bookingId,
            formFactor,
          });
        }}
        locationArrowOnPress={locationArrowOnPress}
        navigateToScanQrCode={navigateToScanQrCode}
      />
    );
  }
  return (
    <>
      {activeBooking?.state === ShmoBookingState.PREPARING && (
        <CityBikeStartTripOverlay
          activeBooking={activeBooking}
          navigateToSupport={navigateToShmoSupport}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.Vehicle &&
        !openPaymentType &&
        !activeBooking?.bookingId && (
          <VehicleSheet
            onVehicleReceived={(vehicle) => {
              if (mapState.assetIsScanned) {
                const feature: Feature<Point, GeoJsonProperties> =
                  getFeatureFromScan({
                    vehicle,
                  });
                dispatchMapState({
                  type: MapStateActionType.Vehicle,
                  feature: feature,
                  customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
                });
              }
            }}
            selectPaymentMethod={selectPaymentMethod}
            onClose={handleCloseSheet}
            onReportParkingViolation={onReportParkingViolation}
            startOnboardingCallback={navigateToShmoOnboarding}
            navigateToSupport={navigateToShmoSupport}
            navigateToLogin={navigateToLogin}
            locationArrowOnPress={locationArrowOnPress}
            navigateToScanQrCode={navigateToScanQrCode}
            navigateToPricingDetails={navigateToPricingDetails}
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
        <ActiveShmoSheet
          mapViewRef={mapViewRef}
          onForceClose={handleCloseSheet}
          navigateSupportCallback={() => {
            navigateToShmoSupport({
              operatorId: activeBooking.asset.operator.id,
              bookingId: activeBooking.bookingId,
              formFactor: activeBooking.asset.formFactor ?? undefined,
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
      {activeBooking?.state === ShmoBookingState.FINISHING &&
        isFocusedAndActive && (
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
      {mapState.bottomSheetType === MapBottomSheetType.BikeStation && (
        <BikeStationBottomSheet
          stationId={mapState.feature?.properties?.id ?? mapState.assetId ?? ''}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(station) => {
            if (mapState.assetIsScanned) {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan({
                  station,
                });

              dispatchMapState({
                type: MapStateActionType.BikeStation,
                feature: feature,
                customZoomLevel: CUSTOM_SCAN_ZOOM_LEVEL,
              });
            }
          }}
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
          navigateSupportCallback={navigateToShmoSupport}
          onVehicleTypeSelected={(
            isStationBasedBooking,
            vehicleId,
            vehicleTypeId,
            stationId,
          ) => {
            dispatchMapState({
              type: MapStateActionType.VehicleScanned,
              assetId: vehicleId,
              isStationBasedBooking,
              vehicleTypeId,
              stationId,
            });
          }}
        />
      )}
      {mapState.bottomSheetType === MapBottomSheetType.CarStation && (
        <CarSharingStationBottomSheet
          stationId={mapState.feature?.properties?.id ?? mapState.assetId ?? ''}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(station) => {
            if (mapState.assetIsScanned) {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan({
                  station,
                });

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
        !!mapState.url && (
          <ExternalRealtimeMapSheet
            onClose={handleCloseSheet}
            url={mapState.url}
            locationArrowOnPress={locationArrowOnPress}
            navigateToScanQrCode={navigateToScanQrCode}
          />
        )}
      {mapState.bottomSheetType === MapBottomSheetType.StopPlace &&
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
        isParkAndRide(mapState.feature) && (
          <ParkAndRideBottomSheet
            name={mapState.feature.properties?.name}
            capacity={Number(mapState.feature.properties?.totalCapacity)}
            parkingFor={mapState.feature.properties?.parkingVehicleTypes}
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
