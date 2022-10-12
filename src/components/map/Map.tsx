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
import React, {forwardRef, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import LocationBar from '@atb/components/map/LocationBar';
import useSelectedFeatureChangeEffect, {
  findClickedStopPlace,
} from './use-selected-feature-change-effect';
import {
  BottomSheetContainer,
  BottomSheetSize,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
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
import {ScreenHeaderWithoutNavigation} from '../screen-header';
import {useTranslation} from '@atb/translations';
import StopPlaceView from '@atb/screens/Departures/StopPlaceView';
import {SearchTime} from '@atb/screens/Departures/utils';
import {Place, Quay} from '@atb/api/types/departures';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import SvgClose from '@atb/assets/svg/mono-icons/actions/Close';

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

type MapProps = {
  initialLocation?: Location;
  selectionMode: MapSelectionMode;
  showDeparturesBottomSheet: boolean;
  onLocationSelect?: (selectedLocation?: GeoLocation | SearchLocation) => void;
  navigateToQuay?: (place: Place, quay: Quay) => void;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
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
  const controlStyles = useControlPositionsStyle();
  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  const bottomSheetStyles = useBottomSheetStyles();

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : currentLocation?.coordinates || FOCUS_ORIGIN,
    [],
  );

  const {mapLines, selectedCoordinates, onMapClick} =
    useSelectedFeatureChangeEffect(
      selectionMode,
      startingCoordinates,
      mapViewRef,
      mapCameraRef,
    );

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
              onMapClick(feature);

              const stopPlaceFeature = await findClickedStopPlace(
                feature,
                mapViewRef,
              );

              if (
                stopPlaceFeature &&
                showDeparturesBottomSheet &&
                navigateToDetails &&
                navigateToQuay
              ) {
                openBottomSheet(
                  (close, focusRef) => (
                    <DeparturesDialogSheet
                      close={close}
                      stopPlaceFeature={stopPlaceFeature}
                      navigateToDetails={navigateToDetails}
                      navigateToQuay={navigateToQuay}
                      ref={focusRef}
                    />
                  ),
                  closeRef,
                  false,
                  bottomSheetStyles.roundEdgesOnTop,
                );
              }
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

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pin: {...shadows},
}));

type DeparturesDialogSheetProps = {
  close: () => void;
  stopPlaceFeature: Feature<Point, GeoJsonProperties>;
  navigateToQuay: (place: Place, quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
};

const DeparturesDialogSheet = forwardRef<View, DeparturesDialogSheetProps>(
  ({close, stopPlaceFeature, navigateToDetails, navigateToQuay}, focusRef) => {
    const {t} = useTranslation();
    const styles = useBottomSheetStyles();
    const [searchTime, setSearchTime] = useState<SearchTime>({
      option: 'now',
      date: new Date().toISOString(),
    });
    const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
    const featureId = stopPlaceFeature.properties?.id;
    const stopDetails = useStopsDetailsData([featureId]);
    const stopPlace = stopDetails.state.data?.stopPlaces?.[0];

    return (
      <>
        {stopPlace && (
          <BottomSheetContainer sheetSize={BottomSheetSize.compact}>
            <ScreenHeaderWithoutNavigation
              title={stopPlace.name}
              color="background_1"
              style={styles.roundEdgesOnTop}
              leftButton={{
                type: 'close',
                onPress: close,
                icon: <ThemeIcon svg={SvgClose} />,
              }}
            />
            <View
              ref={focusRef}
              accessible={true}
              style={styles.departuresContainer}
            >
              <ThemeText
                type="body__secondary"
                color="secondary"
                style={styles.title}
              >
                {t(DeparturesTexts.header.title)}
              </ThemeText>
              <StopPlaceView
                stopPlace={stopPlace}
                showTimeNavigation={false}
                navigateToDetails={(
                  serviceJourneyId: string,
                  serviceDate: string,
                  date?: string,
                  fromQuayId?: string,
                  isTripCancelled?: boolean,
                ) => {
                  close();
                  navigateToDetails(
                    serviceJourneyId,
                    serviceDate,
                    date,
                    fromQuayId,
                    isTripCancelled,
                  );
                }}
                navigateToQuay={(quay) => {
                  close();
                  navigateToQuay(stopPlace, quay);
                }}
                searchTime={searchTime}
                setSearchTime={setSearchTime}
                showOnlyFavorites={showOnlyFavorites}
                setShowOnlyFavorites={setShowOnlyFavorites}
                testID="departuresContentView"
              />
            </View>
          </BottomSheetContainer>
        )}
      </>
    );
  },
);

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    flex: 1,
  },
  title: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  roundEdgesOnTop: {
    borderTopLeftRadius: theme.border.radius.circle,
    borderTopRightRadius: theme.border.radius.circle,
  },
}));

export default Map;
