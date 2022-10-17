import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '@atb/components/map/index';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import LocationBar from '@atb/components/map/LocationBar';
import useSelectedFeatureChangeEffect, {
  findClickedStopPlace,
} from './use-selected-feature-change-effect';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {
  flyToLocation,
  isFeaturePoint,
  zoomIn,
  zoomOut,
} from '@atb/components/map/utils';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {Place, Quay} from '@atb/api/types/departures';
import DeparturesDialogSheet from './DeparturesDialogSheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {useNavigationState} from '@react-navigation/native';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map
 * should behave
 *  - ExploreStops: If only the Stop Places (Bus, Trams stops etc.) should be
 *    interactable
 *  - ExploreLocation: If every selected location should be interactable. It
 *    also shows the Location bar on top of the Map to show the currently
 *    selected location
 */
export type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

type NavigateToQuayCallback = (place: Place, quay: Quay) => void;
type NavigateToDetailsCallback = (
  serviceJourneyId: string,
  serviceDate: string,
  date?: string,
  fromQuayId?: string,
  isTripCancelled?: boolean,
) => void;

type MapProps = {
  initialLocation?: Location;
  selectionMode: MapSelectionMode;
  showDeparturesBottomSheet?: boolean;
  onLocationSelect?: (selectedLocation?: GeoLocation | SearchLocation) => void;
  navigateToQuay?: NavigateToQuayCallback;
  navigateToDetails?: NavigateToDetailsCallback;
};

const Map = ({
  initialLocation,
  selectionMode,
  showDeparturesBottomSheet = false,
  onLocationSelect,
  navigateToQuay,
  navigateToDetails,
}: MapProps) => {
  const {location: currentLocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const {height: windowHeight} = useWindowDimensions();
  const {minHeight} = useBottomNavigationStyles();
  const navigationIndex = useRef(0);
  useNavigationState((state) => (navigationIndex.current = state.index));
  const {
    openDepartureDialogSheet,
    closeDepartureDialogSheet,
    isOpen,
    shouldReopenDepartureDialog,
    resetReopenDepartureDialog,
  } = useDeparturesBottomSheet();
  const [stopPlaceFeature, setStopPlaceFeature] = useState<
    Feature<Point, GeoJsonProperties> | undefined
  >(undefined);

  const windowsHeightBasedOnBottomSheet = windowHeight * 0.5;

  const controlStyles = useControlPositionsStyle(
    isOpen() ? windowsHeightBasedOnBottomSheet - minHeight : 0,
  );

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : currentLocation?.coordinates || FOCUS_ORIGIN,
    [],
  );

  const {mapLines, selectedCoordinates, onMapClick, onClearMap} =
    useSelectedFeatureChangeEffect(
      selectionMode,
      startingCoordinates,
      mapViewRef,
      mapCameraRef,
      [100, 100, windowsHeightBasedOnBottomSheet, 100],
    );

  const openDepartureDialog = useCallback(() => {
    if (stopPlaceFeature) {
      openDepartureDialogSheet(
        stopPlaceFeature,
        () => {
          setStopPlaceFeature(undefined);
          onClearMap();
        },
        navigateToQuay,
        navigateToDetails,
      );
    } else if (isOpen()) {
      closeDepartureDialogSheet();
    }
  }, [
    stopPlaceFeature,
    openDepartureDialogSheet,
    setStopPlaceFeature,
    onClearMap,
    navigateToQuay,
    navigateToDetails,
    closeDepartureDialogSheet,
    isOpen,
  ]);

  useEffect(() => {
    openDepartureDialog();
  }, [stopPlaceFeature]);

  // Opens the bottom departures dialog, once the user returns back from one of the dependents screens inside the dialog.
  useEffect(() => {
    if (
      !isOpen() &&
      navigationIndex.current === 0 &&
      shouldReopenDepartureDialog()
    ) {
      openDepartureDialog();
      resetReopenDepartureDialog();
    }
  }, [
    navigationIndex,
    isOpen,
    shouldReopenDepartureDialog,
    resetReopenDepartureDialog,
  ]);

  return (
    <View style={styles.container}>
      {selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates || startingCoordinates}
          onSelect={onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          onPress={async (feature: Feature) => {
            if (isFeaturePoint(feature)) {
              if (showDeparturesBottomSheet) {
                const stopPlaceFeature = await findClickedStopPlace(
                  feature,
                  mapViewRef,
                );

                setStopPlaceFeature(stopPlaceFeature);
              }

              onMapClick(feature);
            }
          }}
          {...MapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={15}
            centerCoordinate={[
              startingCoordinates.longitude,
              startingCoordinates.latitude,
            ]}
            {...MapCameraConfig}
          />
          {mapLines && <MapRoute lines={mapLines} />}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
          {selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <MapboxGL.PointAnnotation
              id={'selectionPin'}
              coordinate={[
                selectedCoordinates.longitude,
                selectedCoordinates.latitude,
              ]}
            >
              <View style={styles.pin}>
                <SelectionPinConfirm width={40} height={40} />
                <SelectionPinShadow width={40} height={4} />
              </View>
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {currentLocation && (
            <PositionArrow
              onPress={() => {
                onMapClick(currentLocation.coordinates);
                flyToLocation(currentLocation.coordinates, 750, mapCameraRef);
              }}
            />
          )}
          <MapControls
            zoomIn={() => zoomIn(mapViewRef, mapCameraRef)}
            zoomOut={() => zoomOut(mapViewRef, mapCameraRef)}
          />
        </View>
      </View>
    </View>
  );
};

const useDeparturesBottomSheet = () => {
  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    isOpen,
  } = useBottomSheet();
  const closeRef = useRef(null);
  const [shouldReOpenDepartureDialog, setShouldReOpenDepartureDialog] =
    useState(false);

  return {
    isOpen,
    shouldReopenDepartureDialog: () => shouldReOpenDepartureDialog,
    resetReopenDepartureDialog: () => setShouldReOpenDepartureDialog(false),
    closeDepartureDialogSheet: closeBottomSheet,
    openDepartureDialogSheet: (
      stopPlaceFeature: Feature<Point>,
      userClosedDepartureDialog?: () => void,
      navigateToQuay?: NavigateToQuayCallback,
      navigateToDetails?: NavigateToDetailsCallback,
    ) => {
      openBottomSheet(
        (close, focusRef) => (
          <DeparturesDialogSheet
            close={() => {
              setShouldReOpenDepartureDialog(false);
              if (userClosedDepartureDialog) userClosedDepartureDialog();
              close();
            }}
            stopPlaceFeature={stopPlaceFeature}
            navigateToDetails={(
              serviceJourneyId: string,
              serviceDate: string,
              date?: string,
              fromQuayId?: string,
              isTripCancelled?: boolean,
            ) => {
              setShouldReOpenDepartureDialog(true);
              close();
              if (navigateToDetails)
                navigateToDetails(
                  serviceJourneyId,
                  serviceDate,
                  date,
                  fromQuayId,
                  isTripCancelled,
                );
            }}
            navigateToQuay={(stopPlace, quay) => {
              setShouldReOpenDepartureDialog(true);
              close();
              if (navigateToQuay) navigateToQuay(stopPlace, quay);
            }}
            ref={focusRef}
          />
        ),
        closeRef,
        false,
      );
    },
  };
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pin: {...shadows},
}));

export default Map;
