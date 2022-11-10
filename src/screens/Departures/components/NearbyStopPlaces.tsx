import {Place, StopPlacePosition} from '@atb/api/types/departures';
import {NearestStopPlacesQuery} from '@atb/api/types/generated/NearestStopPlacesQuery';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {Location} from '@atb/favorites/types';
import {useGeolocationState} from '@atb/GeolocationContext';
import StopPlaces from '@atb/screens/Departures/components/StopPlaces';
import {useNearestStopsData} from '@atb/screens/Departures/state/nearby-places-state';
import {useDoOnceWhen} from '@atb/screens/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {NavigationProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {StopPlacesMode} from '@atb/screens/Departures/types';

export const NearbyStopPlaces = ({
  navigation,
  fromLocation,
  callerRouteName,
  onSelect,
  mode,
}: {
  navigation: NavigationProp<any>;
  fromLocation: Location | undefined;
  callerRouteName: string;
  onSelect: (place: Place) => void;
  mode: StopPlacesMode;
}) => {
  const {status, location, locationEnabled, requestPermission} =
    useGeolocationState();

  const requestGeoPermission = requestPermission;
  const currentLocation = location || undefined;
  const hasLocationPermission = locationEnabled && status === 'granted';
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');

  const {t} = useTranslation();

  const screenHasFocus = useIsFocused();

  useDoOnceWhen(
    setCurrentLocationAsFromIfEmpty,
    Boolean(currentLocation) && screenHasFocus,
  );

  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state} = useNearestStopsData(fromLocation);

  const {data, isLoading, error} = state;
  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const orderedStopPlaces = useMemo(
    () => sortAndFilterStopPlaces(data),
    [data],
  );

  const openLocationSearch = () =>
    navigation.navigate('LocationSearchStack', {
      screen: 'LocationSearchByTextScreen',
      params: {
        label: t(NearbyTexts.search.label),
        callerRouteName: callerRouteName,
        callerRouteParam: 'location',
        initialLocation: fromLocation,
      },
    });

  useEffect(() => {
    if (
      (fromLocation?.resultType == 'search' ||
        fromLocation?.resultType === 'favorite') &&
      fromLocation?.layer === 'venue'
    ) {
      onSelect(fromLocation);
    }
  }, [fromLocation?.id]);

  function setCurrentLocationAsFrom() {
    navigation.setParams({
      location: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
    });
  }

  function setCurrentLocationAsFromIfEmpty() {
    if (fromLocation) {
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
    if (!fromLocation) return;
    switch (fromLocation.resultType) {
      case 'geolocation':
        return t(DeparturesTexts.stopPlaceList.listDescription.geoLoc);
      case 'search':
      case 'favorite':
        return (
          t(DeparturesTexts.stopPlaceList.listDescription.address) +
          fromLocation.name
        );
      case undefined:
        return;
    }
  };

  useEffect(() => {
    if (updatingLocation)
      setLoadAnnouncement(t(NearbyTexts.stateAnnouncements.updatingLocation));
    if (isLoading && !!fromLocation) {
      setLoadAnnouncement(
        fromLocation?.resultType == 'geolocation'
          ? t(NearbyTexts.stateAnnouncements.loadingFromCurrentLocation)
          : t(
              NearbyTexts.stateAnnouncements.loadingFromGivenLocation(
                fromLocation.name,
              ),
            ),
      );
    }
  }, [updatingLocation, isLoading]);

  function refresh() {
    navigation.setParams({
      location:
        fromLocation?.resultType === 'geolocation'
          ? currentLocation
          : fromLocation,
    });
  }

  return (
    <>
      <SimpleDisappearingHeader
        onRefresh={refresh}
        isRefreshing={isLoading}
        header={
          <Header
            fromLocation={fromLocation}
            updatingLocation={updatingLocation}
            openLocationSearch={openLocationSearch}
            setCurrentLocationOrRequest={setCurrentLocationOrRequest}
            setLocation={(location: Location) => {
              location.resultType === 'search' && location.layer === 'venue'
                ? onSelect(location)
                : navigation.setParams({
                    location,
                  });
            }}
            mode={mode}
          />
        }
        useScroll={activateScroll}
        setFocusOnLoad={true}
      >
        <ScreenReaderAnnouncement message={loadAnnouncement} />
        <StopPlaces
          header={getListDescription()}
          stopPlaces={orderedStopPlaces}
          navigateToPlace={onSelect}
          testID={'nearbyStopsContainerView'}
        />
      </SimpleDisappearingHeader>
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
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  setLocation,
  mode,
}: HeaderProps) {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.static.background.background_accent_0.background,
      }}
    >
      <Section withPadding>
        <LocationInput
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
          contentContainerStyle={styles.favoriteChips}
        />
      )}
    </View>
  );
});

function sortAndFilterStopPlaces(
  data: NearestStopPlacesQuery | null,
): StopPlacePosition[] {
  const edges = data?.nearest?.edges;
  if (!edges) return [];

  // Sort StopPlaces on distance from search location
  const sortedEdges = edges?.sort((edgeA, edgeB) => {
    if (edgeA.node?.distance === undefined) return 1;
    if (edgeB.node?.distance === undefined) return -1;
    return edgeA.node?.distance > edgeB.node?.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  const filteredEdges = sortedEdges.filter(
    (place: StopPlacePosition) => place.node?.place?.quays?.length,
  );

  return filteredEdges;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  favoriteChips: {
    // @TODO Find solution for not hardcoding this. e.g. do proper math
    paddingRight: theme.spacings.medium / 2,
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
}));
