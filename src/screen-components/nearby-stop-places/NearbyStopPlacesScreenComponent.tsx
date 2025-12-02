import {StopPlace} from '@atb/api/types/departures';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {FavoriteChips, Location} from '@atb/modules/favorites';
import {
  useGeolocationContext,
  useStableLocation,
} from '@atb/modules/geolocation';
import {StopPlaces} from './components/StopPlaces';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {DeparturesTexts, NearbyTexts, useTranslation} from '@atb/translations';
import React, {useEffect} from 'react';
import {Platform, RefreshControl, ScrollView, View} from 'react-native';
import {StopPlacesMode} from './types';
import {ScreenHeaderProps} from '@atb/components/screen-header';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {EmptyState} from '@atb/components/empty-state';
import SharedTexts from '@atb/translations/shared';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {useNearestStopPlaceNodesQuery} from './use-nearest-stop-place-nodes-query';

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
  isLargeTitle: boolean;
};

export const NearbyStopPlacesScreenComponent = ({
  location,
  mode,
  headerProps,
  onPressLocationSearch,
  onSelectStopPlace,
  onUpdateLocation,
  onAddFavoritePlace,
  isLargeTitle,
}: Props) => {
  const {locationIsAvailable, requestLocationPermission} =
    useGeolocationContext();
  const geolocation = useStableLocation(75);

  const styles = useStyles();

  const {t} = useTranslation();
  const isFocused = useIsFocusedAndActive();

  const updatingLocation = !location && locationIsAvailable;

  const {data: nearestStopPlaceNodesData, isLoading} =
    useNearestStopPlaceNodesQuery(
      location && {
        ...location.coordinates,
        count: 10,
        distance: 3000,
      },
    );

  // Update geolocation on screen focus if no other location is selected
  useDoOnceWhen(
    () => {
      !location &&
        geolocation &&
        onUpdateLocation({
          ...geolocation,
          resultType: 'geolocation',
        });
    },
    Boolean(geolocation) && isFocused,
  );

  useEffect(() => {
    if (
      (location?.resultType == 'search' ||
        location?.resultType === 'favorite') &&
      location?.layer === 'venue'
    ) {
      onSelectStopPlace(location);
    }
  }, [location, onSelectStopPlace]);

  const a11yLoadingMessage = updatingLocation
    ? t(NearbyTexts.stateAnnouncements.updatingLocation)
    : isLoading && !!location
      ? location?.resultType == 'geolocation'
        ? t(NearbyTexts.stateAnnouncements.loadingFromCurrentLocation)
        : t(
            NearbyTexts.stateAnnouncements.loadingFromGivenLocation(
              location.name,
            ),
          )
      : '';

  const listDescription =
    location?.resultType === 'geolocation'
      ? t(DeparturesTexts.stopPlaceList.listDescription.geoLoc)
      : location?.resultType === 'search' || location?.resultType === 'favorite'
        ? t(DeparturesTexts.stopPlaceList.listDescription.address) +
          location.name
        : undefined;

  return (
    <FullScreenView
      headerProps={{...headerProps}}
      parallaxContent={(focusRef) => (
        <>
          <ScreenHeading
            ref={focusRef}
            text={headerProps.title ?? ''}
            isLarge={isLargeTitle}
          />
          <Header
            fromLocation={location}
            updatingLocation={updatingLocation}
            openLocationSearch={() => onPressLocationSearch(location)}
            setLocation={(location: Location) => {
              location.resultType === 'search' && location.layer === 'venue'
                ? onSelectStopPlace(location)
                : onUpdateLocation(location);
            }}
            mode={mode}
            onAddFavoritePlace={onAddFavoritePlace}
          />
        </>
      )}
      refreshControl={
        // Quick fix for iOS to fix stuck spinner by removing the RefreshControl when not focused
        isFocused || Platform.OS === 'android' ? (
          <RefreshControl
            refreshing={Platform.OS === 'ios' ? false : isLoading}
            onRefresh={() =>
              onUpdateLocation(
                location?.resultType === 'geolocation'
                  ? (geolocation ?? undefined)
                  : location,
              )
            }
          />
        ) : undefined
      }
    >
      <ScrollView>
        <ScreenReaderAnnouncement message={a11yLoadingMessage} />
        {locationIsAvailable || !!location ? (
          <StopPlaces
            headerText={listDescription}
            stopPlaces={nearestStopPlaceNodesData ?? []}
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
    </FullScreenView>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: Location;
  openLocationSearch: () => void;
  setLocation: (location: Location) => void;
  mode: StopPlacesMode;
  onAddFavoritePlace: Props['onAddFavoritePlace'];
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setLocation,
  mode,
  onAddFavoritePlace,
}: HeaderProps) {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {location: geolocation, requestLocationPermission} =
    useGeolocationContext();

  const setCurrentLocationOrRequest = () => {
    if (geolocation) {
      setLocation({...geolocation, resultType: 'geolocation'});
    } else {
      requestLocationPermission(false);
      // The screen should detect when geolocation is available, so no need to
      // manually call setLocation.
    }
  };

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
          backgroundColor={theme.color.background.neutral[1]}
        />
      )}
    </View>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    paddingTop: theme.spacing.medium,
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
