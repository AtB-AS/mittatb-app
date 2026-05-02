import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  ActiveShmoSheet,
  BicycleSheet,
  BikeStationBottomSheet,
  CarSharingStationBottomSheet,
  CityBikeStartTripOverlay,
  FinishedShmoSheet,
  FinishingScooterSheet,
  MapFilterSheet,
  ParkAndRideBottomSheet,
  ScooterSheet,
  SelectShmoPaymentMethodSheet,
  useActiveShmoBookingQuery,
} from '@atb/modules/mobility';

import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getFeatureFromScan,
  isParkAndRide,
  CUSTOM_SCAN_ZOOM_LEVEL,
  flyToLocation,
  mapPositionToCoordinates,
} from './utils';
import MapboxGL from '@rnmapbox/maps';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {MapFilterType, MapProps} from './types';
import {ExternalRealtimeMapSheet} from './components/external-realtime-map/ExternalRealtimeMapSheet';
import {DeparturesDialogSheet} from './components/DeparturesDialogSheet';

import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSelectionAnalytics} from './hooks/use-map-selection-analytics';
import {MapStateActionType} from './mapStateReducer';
import {getSlightlyRaisedMapPadding} from './MapConfig';
import {useWindowDimensions} from 'react-native';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {MapBottomSheetType, useMapContext} from './MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {MapTexts, useTranslation} from '@atb/translations';
import {
  MobilityTexts,
  ParkAndRideTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type SheetVariant =
  | 'Default'
  | 'Scooter'
  | 'Bicycle'
  | 'BikeStation'
  | 'CarStation'
  | 'StopPlace'
  | 'ParkAndRide'
  | 'Filter'
  | 'ExternalMap'
  | 'ActiveShmo'
  | 'FinishingScooter'
  | 'FinishedShmo'
  | 'PaymentMethod';

type MapBottomSheetsProps = {
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapProps: MapProps;
  locationArrowOnPress: () => void;
  navigateToShmoSupport: (params: ShmoHelpParams) => void;
  navigateToScooterOnboarding: () => void;
  navigateToReportParkingViolation: () => void;
  navigateToParkingPhoto: (bookingId: string) => void;
  navigateToScanQrCode: () => void;
  navigateToLogin: () => void;
  navigateToPaymentMethods: () => void;
  defaultBottomSheet?: React.ReactNode;
};

export const MapBottomSheets = ({
  mapViewRef,
  mapCameraRef,
  mapProps,
  locationArrowOnPress,
  navigateToShmoSupport,
  navigateToScooterOnboarding,
  navigateToReportParkingViolation,
  navigateToParkingPhoto,
  navigateToScanQrCode,
  navigateToLogin,
  navigateToPaymentMethods,
  defaultBottomSheet,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const {mapState, dispatchMapState} = useMapContext();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {data: activeBooking} = useActiveShmoBookingQuery(isFocusedAndActive);
  const {bottomSheetMapRef} = useBottomSheetContext();

  const {height: screenHeight} = useWindowDimensions();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();

  const analytics = useAnalyticsContext();
  const mapAnalytics = useMapSelectionAnalytics();
  const {t} = useTranslation();

  const onReportParkingViolation = useCallback(() => {
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigateToReportParkingViolation();
  }, [analytics, navigateToReportParkingViolation]);

  const selectPaymentMethod = useCallback(() => {
    setOpenPaymentType(true);
  }, []);

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

  const variant = useMemo<SheetVariant | null>(() => {
    if (activeBooking?.state === ShmoBookingState.IN_USE) return 'ActiveShmo';
    if (
      activeBooking?.state === ShmoBookingState.FINISHING &&
      isFocusedAndActive
    )
      return 'FinishingScooter';
    if (openPaymentType) return 'PaymentMethod';
    if (
      mapState.bottomSheetType === MapBottomSheetType.FinishedBooking &&
      !!mapState.bookingId
    )
      return 'FinishedShmo';

    if (activeBooking?.bookingId) return defaultBottomSheet ? 'Default' : null;

    switch (mapState.bottomSheetType) {
      case MapBottomSheetType.Scooter:
        return 'Scooter';
      case MapBottomSheetType.Bicycle:
        return 'Bicycle';
      case MapBottomSheetType.BikeStation:
        return 'BikeStation';
      case MapBottomSheetType.CarStation:
        return 'CarStation';
      case MapBottomSheetType.StopPlace:
        return mapState.feature ? 'StopPlace' : null;
      case MapBottomSheetType.ParkAndRideStation:
        return isParkAndRide(mapState.feature) ? 'ParkAndRide' : null;
      case MapBottomSheetType.Filter:
        return 'Filter';
      case MapBottomSheetType.ExternalMap:
        return mapState.url ? 'ExternalMap' : null;
      case MapBottomSheetType.None:
        return defaultBottomSheet ? 'Default' : null;
      default:
        return defaultBottomSheet ? 'Default' : null;
    }
  }, [
    activeBooking?.state,
    activeBooking?.bookingId,
    isFocusedAndActive,
    openPaymentType,
    mapState.bottomSheetType,
    mapState.bookingId,
    mapState.feature,
    mapState.url,
    defaultBottomSheet,
  ]);

  // When a map feature changes (or a feature is selected at all), recenter
  // the camera and log analytics. The sheet itself stays at whatever snap
  // the user has it at — content will crossfade in place.
  useEffect(() => {
    if (mapState.feature) {
      mapAnalytics.logMapSelection(mapState.feature);
      flyToWithPadding();
    }
  }, [flyToWithPadding, mapAnalytics, mapState.feature]);

  const onClosePress = useCallback(() => {
    if (openPaymentType) {
      setOpenPaymentType(false);
      return;
    }
    handleCloseSheet();
  }, [openPaymentType, handleCloseSheet]);

  // Crossfade rendering state: the current (live) inputs determine when to
  // start a transition; the lagged `rendered` state determines what the user
  // actually sees, so the old content stays in place during the fade-out and
  // the new content arrives during fade-in.
  type RenderInputs = {
    variant: SheetVariant | null;
    mapState: typeof mapState;
    activeBooking: typeof activeBooking;
    openPaymentType: boolean;
  };
  const liveInputs: RenderInputs = {
    variant,
    mapState,
    activeBooking,
    openPaymentType,
  };
  const [rendered, setRendered] = useState<RenderInputs>(liveInputs);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({opacity: opacity.value}));

  const transitionKey = (inputs: RenderInputs) =>
    `${inputs.variant ?? 'none'}_${
      inputs.mapState.feature?.properties?.id ?? 'no-feature'
    }_${inputs.openPaymentType ? 'pmt' : 'std'}_${
      inputs.activeBooking?.state ?? 'no-booking'
    }_${inputs.mapState.bookingId ?? 'no-bookid'}_${
      inputs.mapState.url ?? 'no-url'
    }`;

  const liveKey = transitionKey(liveInputs);
  const renderedKey = transitionKey(rendered);

  useEffect(() => {
    if (liveKey === renderedKey) return;
    // Snap the sheet to its default open position (50%) so the new content
    // is fully visible when the fade-in completes, even if the user had
    // dragged the previous sheet down to the minimised stop.
    bottomSheetMapRef.current?.snapToIndex(1);

    opacity.value = withTiming(0, {duration: 120}, (finished) => {
      if (finished) {
        runOnJS(setRendered)(liveInputs);
        opacity.value = withTiming(1, {duration: 200});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveKey]);

  const renderedHeaderProps = useMemo(
    () => getSheetHeaderProps(rendered.variant, rendered.mapState.feature, t),
    [rendered.variant, rendered.mapState.feature, t],
  );

  return (
    <>
      {activeBooking?.state === ShmoBookingState.NOT_STARTED && (
        <CityBikeStartTripOverlay
          activeBooking={activeBooking}
          navigateToSupport={navigateToShmoSupport}
        />
      )}

      {rendered.variant && (
        <MapBottomSheet
          snapPoints={['10%', '50%', '90%']}
          index={1}
          enableDynamicSizing={false}
          canMinimize={false}
          enablePanDownToClose={false}
          closeOnBackdropPress={false}
          allowBackgroundTouch={true}
          heading={renderedHeaderProps.heading}
          bottomSheetHeaderType={renderedHeaderProps.bottomSheetHeaderType}
          locationArrowOnPress={locationArrowOnPress}
          navigateToScanQrCode={navigateToScanQrCode}
          onClosePress={onClosePress}
          // StopPlace's content uses `BottomSheetSectionList` (a VirtualizedList)
          // as its own scroll container; wrapping that in another scroll view
          // would trigger RN's "VirtualizedList nested in ScrollView" warning.
          wrapInScrollView={rendered.variant !== 'StopPlace'}
        >
          <Animated.View style={animatedStyle}>
            {rendered.variant === 'Default' && defaultBottomSheet}

            {rendered.variant === 'Scooter' && (
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
                  rendered.mapState.feature?.properties?.id ??
                  rendered.mapState.assetId ??
                  ''
                }
                onReportParkingViolation={onReportParkingViolation}
                startOnboardingCallback={navigateToScooterOnboarding}
                navigateToSupport={navigateToShmoSupport}
                navigateToLogin={navigateToLogin}
              />
            )}

            {rendered.variant === 'Bicycle' && (
              <BicycleSheet
                vehicleId={
                  rendered.mapState.feature?.properties?.id ??
                  rendered.mapState.assetId ??
                  ''
                }
                isStationBasedBooking={
                  rendered.mapState.isStationBasedBooking ?? false
                }
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
                navigateToLogin={navigateToLogin}
                navigateToSupport={navigateToShmoSupport}
                selectPaymentMethod={selectPaymentMethod}
                startOnboardingCallback={navigateToScooterOnboarding}
              />
            )}

            {rendered.variant === 'BikeStation' && (
              <BikeStationBottomSheet
                stationId={
                  rendered.mapState.feature?.properties?.id ??
                  rendered.mapState.assetId ??
                  ''
                }
                distance={undefined}
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
                navigateSupportCallback={navigateToShmoSupport}
                onVehicleTypeSelected={(vehicleId, isStationBasedBooking) => {
                  if (vehicleId) {
                    dispatchMapState({
                      type: MapStateActionType.BicycleScanned,
                      assetId: vehicleId,
                      isStationBasedBooking: isStationBasedBooking,
                    });
                  }
                }}
              />
            )}

            {rendered.variant === 'CarStation' && (
              <CarSharingStationBottomSheet
                stationId={
                  rendered.mapState.feature?.properties?.id ??
                  rendered.mapState.assetId ??
                  ''
                }
                distance={undefined}
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
              />
            )}

            {rendered.variant === 'Filter' && (
              <MapFilterSheet
                onFilterChanged={(filter: MapFilterType) => {
                  analytics.logEvent('Map', 'Filter changed', {filter});
                }}
              />
            )}

            {rendered.variant === 'ExternalMap' && !!rendered.mapState.url && (
              <ExternalRealtimeMapSheet
                onClose={handleCloseSheet}
                url={rendered.mapState.url}
              />
            )}

            {rendered.variant === 'StopPlace' &&
              !!rendered.mapState.feature && (
                <DeparturesDialogSheet
                  distance={undefined}
                  stopPlaceFeature={rendered.mapState.feature}
                  navigateToDetails={(...params) => {
                    mapProps.navigateToDetails(...params);
                  }}
                  navigateToQuay={(...params) => {
                    mapProps.navigateToQuay(...params);
                  }}
                  navigateToTripSearch={(...params) => {
                    mapProps.navigateToTripSearch(...params);
                  }}
                />
              )}

            {rendered.variant === 'ParkAndRide' &&
              isParkAndRide(rendered.mapState.feature) && (
                <ParkAndRideBottomSheet
                  name={rendered.mapState.feature.properties?.name}
                  capacity={Number(
                    rendered.mapState.feature.properties?.totalCapacity,
                  )}
                  parkingFor={
                    rendered.mapState.feature.properties?.parkingVehicleTypes
                  }
                  feature={rendered.mapState.feature}
                  distance={undefined}
                  navigateToTripSearch={(...params) => {
                    handleCloseSheet();
                    mapProps.navigateToTripSearch(...params);
                  }}
                />
              )}

            {rendered.variant === 'ActiveShmo' && !!rendered.activeBooking && (
              <ActiveShmoSheet
                mapViewRef={mapViewRef}
                onForceClose={handleCloseSheet}
                navigateSupportCallback={() => {
                  if (!rendered.activeBooking) return;
                  navigateToShmoSupport({
                    operatorId: rendered.activeBooking.asset.operator.id,
                    bookingId: rendered.activeBooking.bookingId,
                  });
                }}
                photoNavigation={() => {
                  if (!rendered.activeBooking) return;
                  handleCloseSheet();
                  navigateToParkingPhoto(rendered.activeBooking.bookingId);
                }}
              />
            )}

            {rendered.variant === 'FinishingScooter' &&
              !!rendered.activeBooking && (
                <FinishingScooterSheet
                  onForceClose={handleCloseSheet}
                  photoNavigation={() => {
                    if (!rendered.activeBooking) return;
                    handleCloseSheet();
                    navigateToParkingPhoto(rendered.activeBooking.bookingId);
                  }}
                />
              )}

            {rendered.variant === 'FinishedShmo' &&
              !!rendered.mapState.bookingId && (
                <FinishedShmoSheet
                  bookingId={rendered.mapState.bookingId}
                  onClose={handleCloseSheet}
                  navigateSupportCallback={(operatorId, bookingId) => {
                    handleCloseSheet();
                    navigateToShmoSupport({
                      operatorId,
                      bookingId,
                    });
                  }}
                />
              )}

            {rendered.variant === 'PaymentMethod' && (
              <SelectShmoPaymentMethodSheet
                onSelect={() => {
                  setOpenPaymentType(false);
                }}
                onGoToPaymentPage={() => {
                  setOpenPaymentType(false);
                  navigateToPaymentMethods();
                }}
              />
            )}
          </Animated.View>
        </MapBottomSheet>
      )}
    </>
  );
};

type SheetHeaderProps = {
  heading?: string;
  bottomSheetHeaderType: BottomSheetHeaderType;
};

function getSheetHeaderProps(
  variant: SheetVariant | null,
  feature: Feature<Point, GeoJsonProperties> | undefined,
  t: ReturnType<typeof useTranslation>['t'],
): SheetHeaderProps {
  switch (variant) {
    case 'Default':
    case 'ActiveShmo':
    case 'FinishingScooter':
      return {bottomSheetHeaderType: BottomSheetHeaderType.None};
    case 'Scooter':
      return {
        heading: t(MobilityTexts.vehicleName(FormFactor.Scooter)),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'Bicycle':
      return {
        heading: t(MobilityTexts.vehicleName(FormFactor.Bicycle)),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'BikeStation':
    case 'FinishedShmo':
      return {bottomSheetHeaderType: BottomSheetHeaderType.Close};
    case 'CarStation':
      return {
        heading: t(MobilityTexts.vehicleName(FormFactor.Car)),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'StopPlace':
      return {
        heading: feature?.properties?.name as string | undefined,
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'ParkAndRide':
      return {
        heading: t(ParkAndRideTexts.title),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'Filter':
      return {
        heading: t(MapTexts.filters.bottomSheet.heading),
        bottomSheetHeaderType: BottomSheetHeaderType.Confirm,
      };
    case 'ExternalMap':
      return {
        heading: t(MapTexts.externalRealtimeMap.bottomSheet.heading),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    case 'PaymentMethod':
      return {
        heading: t(SelectPaymentMethodTexts.header.text),
        bottomSheetHeaderType: BottomSheetHeaderType.Close,
      };
    default:
      return {bottomSheetHeaderType: BottomSheetHeaderType.None};
  }
}
