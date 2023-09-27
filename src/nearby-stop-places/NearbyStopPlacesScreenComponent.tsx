import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FavoriteChips, Location} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StopPlaces} from './components/StopPlaces';
import {useNearestStopsData} from './use-nearest-stops-data';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, NearbyTexts, useTranslation} from '@atb/translations';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {Platform, RefreshControl, View} from 'react-native';
import {StopPlacesMode} from './types';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeaderProps} from '@atb/components/screen-header';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

export type NearbyStopPlacesScreenParams = {
  location: Location | undefined;
  mode: StopPlacesMode;
};

type Props = NearbyStopPlacesScreenParams & {
  headerProps: ScreenHeaderProps;
  onPressLocationSearch: (location?: Location) => void;
  onSelectStopPlace: (place: StopPlace) => void;
  onUpdateLocation: (location?: Location) => void;
  onAddFavorite: () => void;
};

export const NearbyStopPlacesScreenComponent = ({
  location,
  mode,
  headerProps,
  onPressLocationSearch,
  onSelectStopPlace,
  onUpdateLocation,
  onAddFavorite,
}: Props) => {
  const {
    status,
    location: geolocation,
    locationEnabled,
    requestPermission,
  } = useGeolocationState();

  const requestGeoPermission = requestPermission;
  const currentLocation = geolocation || undefined;
  const hasLocationPermission = locationEnabled && status === 'granted';
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');

  const {t} = useTranslation();

  const screenHasFocus = useIsFocused();

  useDoOnceWhen(
    setCurrentLocationAsFromIfEmpty,
    Boolean(currentLocation) && screenHasFocus,
  );

  const updatingLocation = !location && hasLocationPermission;

  const {state} = useNearestStopsData(location);

  const {data, isLoading} = state;

  const orderedStopPlaces = useMemo(
    () => sortAndFilterStopPlaces(data),
    [data],
  );

  const openLocationSearch = () => onPressLocationSearch(location);

  useEffect(() => {
    if (
      (location?.resultType == 'search' ||
        location?.resultType === 'favorite') &&
      location?.layer === 'venue'
    ) {
      onSelectStopPlace(location);
    }
  }, [location?.id]);

  function setCurrentLocationAsFrom() {
    onUpdateLocation(
      currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
    );
  }

  function setCurrentLocationAsFromIfEmpty() {
    if (location) {
      return;
    }
    setCurrentLocationAsFrom();
  }

  async function setCurrentLocationOrRequest() {
    if (currentLocation) {
      setCurrentLocationAsFrom();
    } else {
      const status = await requestGeoPermission();
      if (status === 'granted') {
        setCurrentLocationAsFrom();
      }
    }
  }

  const getListDescription = () => {
    if (!location) return;
    switch (location.resultType) {
      case 'geolocation':
        return t(DeparturesTexts.stopPlaceList.listDescription.geoLoc);
      case 'search':
      case 'favorite':
        return (
          t(DeparturesTexts.stopPlaceList.listDescription.address) +
          location.name
        );
      case undefined:
        return;
    }
  };

  useEffect(() => {
    if (updatingLocation)
      setLoadAnnouncement(t(NearbyTexts.stateAnnouncements.updatingLocation));
    if (isLoading && !!location) {
      setLoadAnnouncement(
        location?.resultType == 'geolocation'
          ? t(NearbyTexts.stateAnnouncements.loadingFromCurrentLocation)
          : t(
              NearbyTexts.stateAnnouncements.loadingFromGivenLocation(
                location.name,
              ),
            ),
      );
    }
  }, [updatingLocation, isLoading]);

  function refresh() {
    onUpdateLocation(
      location?.resultType === 'geolocation' ? currentLocation : location,
    );
  }

  const isFocused = useIsFocusedAndActive();

  return (
    <FullScreenView
      refreshControl={
        // Quick fix for iOS to fix stuck spinner by removing the RefreshControl when not focused
        isFocused || Platform.OS === 'android' ? (
          <RefreshControl
            refreshing={Platform.OS === 'ios' ? false : isLoading}
            onRefresh={refresh}
          />
        ) : undefined
      }
      headerProps={headerProps}
      parallaxContent={() => (
        <Header
          fromLocation={location}
          updatingLocation={updatingLocation}
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
          setLocation={(location: Location) => {
            location.resultType === 'search' && location.layer === 'venue'
              ? onSelectStopPlace(location)
              : onUpdateLocation(location);
          }}
          mode={mode}
          onAddFavorite={onAddFavorite}
        />
      )}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />
      <StopPlaces
        header={getListDescription()}
        stopPlaces={orderedStopPlaces}
        navigateToPlace={onSelectStopPlace}
        testID={'nearbyStopsContainerView'}
      />
    </FullScreenView>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: Location;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  setLocation: (location: Location) => void;
  mode: StopPlacesMode;
  onAddFavorite: Props['onAddFavorite'];
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  setLocation,
  mode,
  onAddFavorite,
}: HeaderProps) {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <Section style={styles.locationInputSection}>
        <LocationInputSectionItem
          label={t(NearbyTexts.location.departurePicker.label)}
          updatingLocation={updatingLocation}
          location={fromLocation}
          onPress={openLocationSearch}
          accessibilityLabel={t(NearbyTexts.location.departurePicker.a11yLabel)}
          icon={<ThemeIcon svg={LocationIcon} />}
          onIconPress={setCurrentLocationOrRequest}
          iconAccessibility={{
            accessible: true,
            accessibilityLabel: t(
              NearbyTexts.location.locationButton.a11yLabel,
            ),
            accessibilityRole: 'button',
          }}
        />
      </Section>
      {mode === 'Departure' && (
        <FavoriteChips
          onSelectLocation={(location) => {
            setLocation(location);
          }}
          chipTypes={['favorites', 'add-favorite']}
          style={styles.favoriteChips}
          onAddFavorite={onAddFavorite}
        />
      )}
    </View>
  );
});

function sortAndFilterStopPlaces(
  data?: NearestStopPlaceNode[],
): NearestStopPlaceNode[] {
  if (!data) return [];

  // Sort StopPlaces on distance from search location
  const sortedNodes = data?.sort((n1, n2) => {
    if (n1.distance === undefined) return 1;
    if (n2.distance === undefined) return -1;
    return n1.distance > n2.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  return sortedNodes.filter((n) => n.place?.quays?.length);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.static.background.background_accent_0.background,
  },
  locationInputSection: {
    marginHorizontal: theme.spacings.medium,
  },
  favoriteChips: {
    marginTop: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
  },
}));
