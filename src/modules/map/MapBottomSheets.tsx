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
import {BottomSheetType, useMapContext} from './MapContext';
import {InteractionManager} from 'react-native';
import {flyToLocation, getFeatureFromScan, getMapPadding} from './utils';
import MapboxGL from '@rnmapbox/maps';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  AutoSelectableMapItem,
  MapFilterType,
  MapProps,
  ParkingType,
} from './types';
import {ExternalRealtimeMapSheet} from './components/external-realtime-map/ExternalRealtimeMapSheet';
import {DeparturesDialogSheet} from './components/DeparturesDialogSheet';

import {Feature, GeoJsonProperties, Point} from 'geojson';
import {useMapSelectionAnalytics} from './hooks/use-map-selection-analytics';
import {MapStateActionType} from './mapStateReducer';

type MapBottomSheetsProps = {
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  tabBarHeight?: number;
  mapProps: MapProps;
};

export const MapBottomSheets = ({
  mapCameraRef,
  mapViewRef,
  tabBarHeight,
  mapProps,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const navigateToPaymentMethods = useEnterPaymentMethods();
  const {mapSelectionState, mapSelectionDispatch, setMapFilterIsOpen} =
    useMapContext();
  const {getCurrentCoordinates} = useGeolocationContext();
  const {data: activeBooking} = useActiveShmoBookingQuery();

  const analytics = useAnalyticsContext();
  const mapAnalytics = useMapSelectionAnalytics();
  const navigation = useNavigation<RootNavigationProps>();

  const onReportParkingViolation = useCallback(() => {
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [analytics, navigation]);

  const flyToMapItemLocation = useCallback(
    (mapItem: AutoSelectableMapItem) => {
      InteractionManager.runAfterInteractions(() => {
        /*
            When an item has already been loaded, onMapItemReceived will be called immediately, in which case flyToLocation won't work.
            This is why runAfterInteractions is used here. We may find that a setTimeout is needed as well.
          */
        mapCameraRef &&
          flyToLocation({
            coordinates: {
              latitude: mapItem.lat,
              longitude: mapItem.lon,
            },
            padding: getMapPadding(tabBarHeight),
            mapCameraRef,
            mapViewRef,
            zoomLevel: 19, // no clustering at this zoom level
          });
      });
    },
    [mapCameraRef, mapViewRef, tabBarHeight],
  );

  const flyToUserLocation = useCallback(async () => {
    const coordinates = await getCurrentCoordinates();
    mapCameraRef &&
      flyToLocation({
        coordinates: {
          latitude: coordinates?.latitude ?? 0,
          longitude: coordinates?.longitude ?? 0,
        },
        padding: getMapPadding(tabBarHeight),
        mapCameraRef,
        mapViewRef,
        zoomLevel: 15,
      });
  }, [getCurrentCoordinates, mapCameraRef, mapViewRef, tabBarHeight]);

  async function selectPaymentMethod() {
    setOpenPaymentType(true);
  }

  const handleCloseSheet = useCallback(() => {
    mapSelectionDispatch({type: MapStateActionType.None});
  }, [mapSelectionDispatch]);

  useEffect(() => {
    if (mapSelectionState.feature) {
      mapAnalytics.logMapSelection(mapSelectionState.feature);
    }
    if (mapSelectionState.mapState === BottomSheetType.Filter) {
      setMapFilterIsOpen(true);
    }
  }, [
    mapAnalytics,
    mapSelectionState.feature,
    mapSelectionState.mapState,
    setMapFilterIsOpen,
  ]);

  return (
    <>
      {mapSelectionState.mapState === BottomSheetType.Scooter &&
        !openPaymentType &&
        !activeBooking?.bookingId && (
          <ScooterSheet
            onVehicleReceived={(item) => {
              const feature: Feature<Point, GeoJsonProperties> =
                getFeatureFromScan(item, mapSelectionState);

              mapSelectionDispatch({
                type: MapStateActionType.Scooter,
                assetId: feature.properties?.id as string,
                feature: feature,
              });
              flyToMapItemLocation(item);
            }}
            selectPaymentMethod={selectPaymentMethod}
            vehicleId={(mapSelectionState.assetId as string) ?? ''}
            onClose={handleCloseSheet}
            onReportParkingViolation={onReportParkingViolation}
            navigation={navigation}
            startOnboardingCallback={() => {
              navigation.navigate('Root_ShmoOnboardingScreen');
            }}
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
        />
      )}

      {activeBooking?.state === ShmoBookingState.IN_USE && (
        <ActiveScooterSheet
          mapViewRef={mapViewRef}
          onForceClose={handleCloseSheet}
          onActiveBookingReceived={flyToUserLocation}
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
        />
      )}
      {mapSelectionState.mapState === BottomSheetType.FinishedBooking &&
        !!mapSelectionState?.assetId && (
          <FinishedScooterSheet
            bookingId={mapSelectionState.assetId as string}
            onClose={handleCloseSheet}
            navigateSupportCallback={(operatorId, bookingId) => {
              handleCloseSheet();
              navigation.navigate('Root_ScooterHelpScreen', {
                operatorId,
                bookingId,
              });
            }}
          />
        )}
      {mapSelectionState.mapState === BottomSheetType.Bicycle && (
        <BicycleSheet
          vehicleId={mapSelectionState.assetId as string}
          onClose={handleCloseSheet}
          onVehicleReceived={(item) => {
            const feature: Feature<Point, GeoJsonProperties> =
              getFeatureFromScan(item, mapSelectionState);

            mapSelectionDispatch({
              type: MapStateActionType.Bicycle,
              assetId: feature.properties?.id as string,
              feature: feature,
            });
            flyToMapItemLocation(item);
          }}
        />
      )}

      {mapSelectionState.mapState === BottomSheetType.BikeStation && (
        <BikeStationBottomSheet
          stationId={mapSelectionState.assetId as string}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(item) => {
            const feature: Feature<Point, GeoJsonProperties> =
              getFeatureFromScan(item, mapSelectionState);

            mapSelectionDispatch({
              type: MapStateActionType.BikeStation,
              assetId: feature.properties?.id as string,
              feature: feature,
            });
            flyToMapItemLocation(item);
          }}
        />
      )}
      {mapSelectionState.mapState === BottomSheetType.CarStation && (
        <CarSharingStationBottomSheet
          stationId={mapSelectionState.assetId as string}
          distance={undefined}
          onClose={handleCloseSheet}
          onStationReceived={(item) => {
            const feature: Feature<Point, GeoJsonProperties> =
              getFeatureFromScan(item, mapSelectionState);

            mapSelectionDispatch({
              type: MapStateActionType.CarStation,
              assetId: feature.properties?.id as string,
              feature: feature,
            });
            flyToMapItemLocation(item);
          }}
        />
      )}

      {mapSelectionState.mapState === BottomSheetType.Filter && (
        <MapFilterSheet
          onFilterChanged={(filter: MapFilterType) => {
            analytics.logEvent('Map', 'Filter changed', {filter});
            mapProps.vehicles?.onFilterChange(filter.mobility);
            mapProps.stations?.onFilterChange(filter.mobility);
          }}
          onClose={() => {
            handleCloseSheet();
            setMapFilterIsOpen(false);
          }}
        />
      )}
      {mapSelectionState.mapState === BottomSheetType.ExternalMap && (
        <ExternalRealtimeMapSheet
          onClose={handleCloseSheet}
          url={mapSelectionState.url!}
        />
      )}
      {mapSelectionState?.mapState === BottomSheetType.StopPlace &&
        mapSelectionState.feature && (
          <DeparturesDialogSheet
            tabBarHeight={tabBarHeight}
            onClose={handleCloseSheet}
            distance={undefined}
            stopPlaceFeature={mapSelectionState.feature}
            navigateToDetails={(...params) => {
              handleCloseSheet();
              mapProps.navigateToDetails(...params);
            }}
            navigateToQuay={(...params) => {
              handleCloseSheet();
              mapProps.navigateToQuay(...params);
            }}
            navigateToTripSearch={(...params) => {
              handleCloseSheet();
              mapProps.navigateToTripSearch(...params);
            }}
          />
        )}
      {mapSelectionState.mapState === BottomSheetType.ParkAndRideStation && (
        <ParkAndRideBottomSheet
          name={mapSelectionState.feature?.properties?.name}
          capacity={mapSelectionState.feature?.properties?.totalCapacity}
          parkingFor={
            mapSelectionState.feature?.properties?.parkingVehicleTypes
          }
          feature={mapSelectionState.feature as Feature<Point, ParkingType>}
          distance={undefined}
          onClose={handleCloseSheet}
          navigateToTripSearch={(...params) => {
            handleCloseSheet();
            mapProps.navigateToTripSearch(...params);
          }}
        />
      )}
    </>
  );
};
