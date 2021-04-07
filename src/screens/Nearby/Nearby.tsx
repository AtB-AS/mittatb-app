import {ErrorType} from '@atb/api/utils';
import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import AccessibleText, {
  screenReaderPause,
} from '@atb/components/accessible-text';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {ActionItem, LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {Location, LocationWithMetadata} from '@atb/favorites/types';
import {useReverseGeocoder} from '@atb/geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useLocationSearchValue} from '@atb/location-search';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  AssistantTexts,
  dictionary,
  NearbyTexts,
  TranslatedString,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {NearbyStackParams} from '.';
import Loading from '../Loading';
import DeparturesList from '../../components/departure-list/DeparturesList';
import {useDepartureData} from './state';

type NearbyRouteName = 'NearbyRoot';
const NearbyRouteNameStatic: NearbyRouteName = 'NearbyRoot';

export type NearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<NearbyStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type NearbyScreenParams = {
  location: LocationWithMetadata;
};

export type NearbyScreenProp = RouteProp<NearbyStackParams, NearbyRouteName>;

type RootProps = {
  navigation: NearbyScreenNavigationProp;
  route: NearbyScreenProp;
};

export default function NearbyScreen({navigation, route}: RootProps) {
  const {
    status,
    location,
    locationEnabled,
    requestPermission,
  } = useGeolocationState();

  const {closestLocation: currentLocation} = useReverseGeocoder(
    location?.coords ?? null,
  );

  if (!status) {
    return <Loading />;
  }

  return (
    <NearbyOverview
      requestGeoPermission={requestPermission}
      hasLocationPermission={locationEnabled && status === 'granted'}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
}

type Props = {
  currentLocation?: Location;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: NearbyScreenNavigationProp;
};

const NearbyOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const searchedFromLocation = useLocationSearchValue<NearbyScreenProp>(
    'location',
  );
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useNearbyStyles();

  const currentSearchLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const updatingLocation = !fromLocation && hasLocationPermission;
  const {state, refresh, loadMore, toggleShowFavorites} = useDepartureData(
    fromLocation,
  );
  const {
    data,
    tick,
    isLoading,
    isFetchingMore,
    error,
    showOnlyFavorites,
  } = state;

  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const {t} = useTranslation();

  const onScrollViewEndReached = () => data?.length && loadMore();

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: t(NearbyTexts.search.label),
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  const fullLocation = (selectedLocation: LocationWithMetadata) => {
    navigation.setParams({
      location: selectedLocation,
    });
  };

  function setCurrentLocationAsFrom() {
    navigation.setParams({
      location: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
    });
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

  return (
    <SimpleDisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      header={
        <Header
          fromLocation={fromLocation}
          updatingLocation={updatingLocation}
          fullLocation={fullLocation}
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
        />
      }
      headerTitle={t(NearbyTexts.header.title)}
      useScroll={activateScroll}
      leftButton={{type: 'back'}}
      alternativeTitleComponent={
        <AccessibleText
          prefix={t(NearbyTexts.header.altTitle.a11yPrefix)}
          type={'paragraphHeadline'}
        >
          {fromLocation?.name}
        </AccessibleText>
      }
      onEndReached={onScrollViewEndReached}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />

      {data !== null && (
        <View style={styles.container}>
          <ActionItem
            transparent
            text={t(NearbyTexts.favorites.toggle)}
            mode="toggle"
            checked={showOnlyFavorites}
            onPress={toggleShowFavorites}
          />
        </View>
      )}

      <DeparturesList
        currentLocation={currentLocation}
        showOnlyFavorites={showOnlyFavorites}
        departures={data}
        lastUpdated={tick}
        isFetchingMore={isFetchingMore && !isLoading}
        isLoading={isLoading}
        isInitialScreen={isInitialScreen}
        error={error ? translateErrorType(error.type, t) : undefined}
      />
    </SimpleDisappearingHeader>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: LocationWithMetadata;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  fullLocation(selectedLocation: LocationWithMetadata): void;
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  fullLocation,
}: HeaderProps) {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <>
      <Section withPadding>
        <LocationInput
          label={t(NearbyTexts.location.departurePicker.label)}
          updatingLocation={updatingLocation}
          location={fromLocation}
          onPress={openLocationSearch}
          accessibilityLabel={t(NearbyTexts.location.departurePicker.a11yLabel)}
          icon={<ThemeIcon svg={CurrentLocationArrow} />}
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
      <FavoriteChips
        key="favoriteChips"
        chipTypes={['favorites']}
        onSelectLocation={fullLocation}
        containerStyle={{
          marginTop: theme.spacings.xSmall,
          marginBottom: theme.spacings.medium,
        }}
        contentContainerStyle={{
          // @TODO Find solution for not hardcoding this. e.g. do proper math
          paddingLeft: theme.spacings.medium,
          paddingRight: theme.spacings.medium / 2,
        }}
        chipActionHint={
          t(AssistantTexts.favorites.favoriteChip.a11yHint) +
          t(dictionary.toPlace) +
          screenReaderPause
        }
      />
    </>
  );
});
const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingTop: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
  },
}));

function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(NearbyTexts.messages.networkError);
    default:
      return t(NearbyTexts.messages.defaultFetchError);
  }
}
