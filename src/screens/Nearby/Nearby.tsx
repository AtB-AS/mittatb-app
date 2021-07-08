import {ErrorType} from '@atb/api/utils';
import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import AccessibleText from '@atb/components/accessible-text';
import Button from '@atb/components/button';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {ActionItem, LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import DeparturesList from '@atb/departure-list/DeparturesList';
import {Location, LocationWithMetadata} from '@atb/favorites/types';
import {useReverseGeocoder} from '@atb/geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useOnlySingleLocation} from '@atb/location-search';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet} from '@atb/theme';
import {ThemeColor} from '@atb/theme/colors';
import {
  Language,
  NearbyTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  formatToLongDateTime,
  formatToShortDateTimeWithoutYear,
  formatToSimpleDate,
} from '@atb/utils/date';
import {TFunc} from '@leile/lobo-t';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {NearbyStackParams} from '.';
import Loading from '../Loading';
import {SearchTime, useSearchTimeValue} from './departure-date-picker';
import {useDepartureData} from './state';

const themeColor: ThemeColor = 'background_gray';

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
  const searchedFromLocation = useOnlySingleLocation<NearbyScreenProp>(
    'location',
  );
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useNearbyStyles();

  const searchTime = useSearchTimeValue('searchTime', {
    option: 'now',
    date: new Date().toISOString(),
  });

  const currentSearchLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state, refresh, loadMore, toggleShowFavorites} = useDepartureData(
    fromLocation,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const {
    data,
    tick,
    isLoading,
    isFetchingMore,
    error,
    showOnlyFavorites,
    queryInput,
  } = state;

  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const {t, language} = useTranslation();

  const onScrollViewEndReached = () => data?.length && loadMore();

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: t(NearbyTexts.search.label),
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  const onSearchTimePress = useCallback(
    function onSearchTimePress() {
      navigation.navigate('DateTimePicker', {
        callerRouteName: 'NearbyRoot',
        callerRouteParam: 'searchTime',
        searchTime,
      });
    },
    [searchTime],
  );

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
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
          onSearchTimePress={onSearchTimePress}
          searchTime={searchTime}
          timeOfLastSearch={queryInput.startTime}
        />
      }
      headerTitle={t(NearbyTexts.header.title)}
      useScroll={activateScroll}
      leftButton={{type: 'home', color: themeColor}}
      alternativeTitleComponent={
        <AccessibleText
          prefix={t(NearbyTexts.header.altTitle.a11yPrefix)}
          type={'body__primary--bold'}
          color={themeColor}
        >
          {getHeaderAlternativeTitle(
            fromLocation?.name ?? '',
            searchTime,
            t,
            language,
          )}
        </AccessibleText>
      }
      onEndReached={onScrollViewEndReached}
      alertContext={'travel'}
      setFocusOnLoad={true}
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
  onSearchTimePress: () => void;
  timeOfLastSearch: string;
  searchTime: SearchTime;
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  onSearchTimePress,
  timeOfLastSearch,
  searchTime,
}: HeaderProps) {
  const {t, language} = useTranslation();
  const styles = useNearbyStyles();

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
      <View style={styles.paddedContainer} key="dateInput">
        <Button
          text={getSearchTimeLabel(searchTime, timeOfLastSearch, t, language)}
          accessibilityHint={t(NearbyTexts.dateInput.a11yHint)}
          color="secondary_3"
          onPress={onSearchTimePress}
        />
      </View>
    </>
  );
});
const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingTop: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
  },
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
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

function getSearchTimeLabel(
  searchTime: SearchTime,
  timeOfLastSearch: string,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const date = searchTime.option === 'now' ? timeOfLastSearch : searchTime.date;
  const time = formatToLongDateTime(date, language);

  switch (searchTime.option) {
    case 'now':
      return t(NearbyTexts.dateInput.departureNow(time));
    case 'departure':
      return t(NearbyTexts.dateInput.departure(time));
  }
  return time;
}

function getHeaderAlternativeTitle(
  locationName: string,
  searchTime: SearchTime,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const time = formatToShortDateTimeWithoutYear(searchTime.date, language);

  switch (searchTime.option) {
    case 'now':
      return locationName;
    default:
      return t(NearbyTexts.header.departureFuture(locationName, time));
  }
}
