import {NearestStopPlaceNode, StopPlace} from '@atb/api/types/departures';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FavoriteChips, Location} from '@atb/modules/favorites';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {StopPlaces} from './components/StopPlaces';
import {useNearestStopsData} from './use-nearest-stops-data';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, NearbyTexts, useTranslation} from '@atb/translations';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {Platform, RefreshControl, ScrollView, View} from 'react-native';
import {StopPlacesMode} from './types';
import {
  FullScreenHeader,
  ScreenHeaderProps,
} from '@atb/components/screen-header';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {EmptyState} from '@atb/components/empty-state';
import SharedTexts from '@atb/translations/shared';

export type NearbyStopPlacesScreenParams = {
  location: Location | undefined;
  mode: StopPlacesMode;
};

type Props = NearbyStopPlacesScreenParams & {
  headerProps: ScreenHeaderProps;
  onPressLocationSearch: (location?: Location) => void;
  onSelectStopPlace: (place: StopPlace) => void;
  onUpdateLocation: (location?: Location) => void;
  onAddFavoritePlace: () => void;
};

export const NearbyStopPlacesScreenComponent = ({
  location,
  mode,
  headerProps,
  onPressLocationSearch,
  onSelectStopPlace,
  onUpdateLocation,
  onAddFavoritePlace,
}: Props) => {
  const {
    locationIsAvailable,
    location: geolocation,
    requestLocationPermission,
  } = useGeolocationContext();

  const currentLocation = geolocation || undefined;

  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');

  const styles = useStyles();

  const {t} = useTranslation();

  const screenHasFocus = useIsFocused();

  useDoOnceWhen(
    setCurrentLocationAsFromIfEmpty,
    Boolean(currentLocation) && screenHasFocus,
  );

  const updatingLocation = !location && locationIsAvailable;

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
  }, [location, onSelectStopPlace]);

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
      const status = await requestLocationPermission(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatingLocation, isLoading, t]);

  function refresh() {
    onUpdateLocation(
      location?.resultType === 'geolocation' ? currentLocation : location,
    );
  }

  const isFocused = useIsFocusedAndActive();

  return (
    <>
      <FullScreenHeader {...headerProps} />
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
        onAddFavoritePlace={onAddFavoritePlace}
      />
      <ScrollView
        refreshControl={
          // Quick fix for iOS to fix stuck spinner by removing the RefreshControl when not focused
          isFocused || Platform.OS === 'android' ? (
            <RefreshControl
              refreshing={Platform.OS === 'ios' ? false : isLoading}
              onRefresh={refresh}
            />
          ) : undefined
        }
      >
        <ScreenReaderAnnouncement message={loadAnnouncement} />
        {locationIsAvailable || !!location ? (
          <StopPlaces
            headerText={getListDescription()}
            stopPlaces={orderedStopPlaces}
            navigateToPlace={onSelectStopPlace}
            testID="nearbyStopsContainerView"
            location={location}
            isLoading={isLoading}
          />
        ) : (
          <EmptyState
            title={t(NearbyTexts.stateAnnouncements.noAccessToLocationTitle)}
            details={t(NearbyTexts.stateAnnouncements.noAccessToLocation)}
            illustrationComponent={
              <ThemedOnBehalfOf
                height={90}
                style={styles.emptyStopPlacesIllustration}
              />
            }
            buttonProps={{
              onPress: () => requestLocationPermission(false),
              text: t(NearbyTexts.stateAnnouncements.sharePositionButton.title),
            }}
            testID="noAccessToLocation"
          />
        )}
      </ScrollView>
    </>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: Location;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  setLocation: (location: Location) => void;
  mode: StopPlacesMode;
  onAddFavoritePlace: Props['onAddFavoritePlace'];
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  setLocation,
  mode,
  onAddFavoritePlace,
}: HeaderProps) {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.header}>
      <Section style={styles.locationInputSection}>
        <LocationInputSectionItem
          label={t(SharedTexts.from)}
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
          onAddFavoritePlace={onAddFavoritePlace}
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
    backgroundColor: theme.color.background.accent[0].background,
    paddingBottom: theme.spacing.medium,
  },
  locationInputSection: {
    marginHorizontal: theme.spacing.medium,
  },
  favoriteChips: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  emptyStopPlacesIllustration: {
    marginBottom: theme.spacing.medium,
  },
}));
