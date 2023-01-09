import {ErrorType} from '@atb/api/utils';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {AccessibleText} from '@atb/components/text';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {SimpleDisappearingHeader} from '@atb/components/disappearing-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {
  LocationInputSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import DeparturesList from '@atb/departure-list/DeparturesList';
import {GeoLocation, Location} from '@atb/favorites/types';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useOnlySingleLocation} from '@atb/location-search';
import {usePreferences} from '@atb/preferences';
import {useDoOnceWhen} from '@atb/screens/utils';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {
  Language,
  NearbyTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {formatToShortDateTimeWithoutYear} from '@atb/utils/date';
import {TFunc} from '@leile/lobo-t';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Loading from '../Loading';
import DepartureTimeSheet from './DepartureTimeSheet';
import {useDepartureData} from './state';
import {NearbyRouteNameStatic, NearbyScreenProps, SearchTime} from './types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type RootProps = NearbyScreenProps<'NearbyRoot'>;

export default function NearbyScreen({navigation}: RootProps) {
  const {status, location, locationEnabled, requestPermission} =
    useGeolocationState();

  if (!status) {
    return <Loading />;
  }

  return (
    <NearbyOverview
      requestGeoPermission={requestPermission}
      hasLocationPermission={locationEnabled && status === 'granted'}
      currentLocation={location || undefined}
      navigation={navigation}
    />
  );
}

type Props = {
  currentLocation?: GeoLocation;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: RootProps['navigation'];
};

const NearbyOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const fromLocation = useOnlySingleLocation<RootProps['route']>('location');

  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useNearbyStyles();

  const screenHasFocus = useIsFocused();

  useDoOnceWhen(
    setCurrentLocationAsFromIfEmpty,
    Boolean(currentLocation) && screenHasFocus,
  );

  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state, loadMore, setShowFavorites, setSearchTime} =
    useDepartureData(fromLocation);

  const {
    data,
    tick,
    isLoading,
    isFetchingMore,
    error,
    showOnlyFavorites,
    queryInput,
    searchTime,
  } = state;

  const {
    preferences: {departuresShowOnlyFavorites: pref__showOnlyFavorites},
    setPreference,
  } = usePreferences();

  function toggleShowFavorites() {
    const show = !showOnlyFavorites;
    setShowFavorites(show);
    setPreference({departuresShowOnlyFavorites: show});
  }

  useEffect(() => {
    if (
      pref__showOnlyFavorites != undefined &&
      showOnlyFavorites != pref__showOnlyFavorites
    ) {
      setShowFavorites(pref__showOnlyFavorites);
    }
  }, [pref__showOnlyFavorites]);

  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const {t, language} = useTranslation();

  const onScrollViewEndReached = () => data?.length && loadMore();

  const openLocationSearch = () =>
    navigation.navigate('LocationSearchStack', {
      screen: 'LocationSearchByTextScreen',
      params: {
        label: t(NearbyTexts.search.label),
        callerRouteName: NearbyRouteNameStatic,
        callerRouteParam: 'location',
        initialLocation: fromLocation,
      },
    });

  const {open: openBottomSheet} = useBottomSheet();
  const onLaterTimePress = () => {
    openBottomSheet((close, focusRef) => (
      <DepartureTimeSheet
        ref={focusRef}
        close={close}
        initialTime={searchTime}
        setSearchTime={setSearchTime}
        allowTimeInPast={false}
      ></DepartureTimeSheet>
    ));
  };

  const onNowPress = () =>
    setSearchTime({
      option: 'now',
      date: new Date().toISOString(),
    });

  function setCurrentLocationAsFromIfEmpty() {
    if (fromLocation) {
      return;
    }
    setCurrentLocationAsFrom();
  }

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
  const {leftButton} = useServiceDisruptionSheet();

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
    <SimpleDisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      leftButton={leftButton}
      header={
        <Header
          fromLocation={fromLocation}
          updatingLocation={updatingLocation}
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
          onNowPress={onNowPress}
          onLaterTimePress={onLaterTimePress}
          searchTime={searchTime}
          timeOfLastSearch={queryInput.startTime}
        />
      }
      headerTitle={t(NearbyTexts.header.title)}
      useScroll={activateScroll}
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
      globalMessageContext="app-departures"
      setFocusOnLoad={true}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />

      {data !== null && (
        <View style={styles.container}>
          <ToggleSectionItem
            transparent
            text={t(NearbyTexts.favorites.toggle)}
            value={showOnlyFavorites}
            onValueChange={toggleShowFavorites}
            testID="showOnlyFavoritesButton"
          />
        </View>
      )}

      <DeparturesList
        locationOrStopPlace={currentLocation}
        showOnlyFavorites={showOnlyFavorites}
        departures={data}
        lastUpdated={tick}
        isFetchingMore={isFetchingMore && !isLoading}
        isLoading={isLoading}
        isInitialScreen={isInitialScreen}
        error={error ? translateErrorType(error.type, t) : undefined}
        searchDate={searchTime.date}
      />
    </SimpleDisappearingHeader>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: Location;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  onNowPress: () => void;
  onLaterTimePress: () => void;
  timeOfLastSearch: string;
  searchTime: SearchTime;
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  onLaterTimePress,
  onNowPress,
  searchTime,
}: HeaderProps) {
  const {t, language} = useTranslation();
  const styles = useNearbyStyles();

  return (
    <>
      <Section withPadding>
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
          testID="searchFromButton"
        />
      </Section>
      <View style={styles.paddedContainer} key="dateInput">
        <Button
          mode={searchTime.option == 'now' ? 'primary' : 'tertiary'}
          interactiveColor="interactive_0"
          text={t(NearbyTexts.search.now.label)}
          accessibilityLabel={t(NearbyTexts.search.now.a11yLabel)}
          accessibilityHint={t(NearbyTexts.search.now.a11yHint)}
          onPress={onNowPress}
          viewContainerStyle={styles.dateInputButtonContainer}
          style={styles.dateInputButton}
          testID="searchTimeNowButton"
        />
        <Button
          mode={searchTime.option == 'now' ? 'tertiary' : 'primary'}
          interactiveColor="interactive_0"
          text={
            searchTime.option == 'now'
              ? t(NearbyTexts.search.later.label)
              : formatToShortDateTimeWithoutYear(searchTime.date, language)
          }
          accessibilityLabel={t(NearbyTexts.search.later.a11yLabel)}
          accessibilityHint={t(NearbyTexts.search.later.a11yHint)}
          onPress={onLaterTimePress}
          viewContainerStyle={styles.dateInputButtonContainer}
          style={styles.dateInputButton}
          testID="searchTimeLaterButton"
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
    marginBottom: theme.spacings.medium,
    flexDirection: 'row',
    flex: 1,
    alignContent: 'space-between',
    borderStyle: 'solid',
    borderColor: theme.interactive.interactive_0.default.background,
    borderWidth: 2,
    padding: 2,
    borderRadius: 12,
  },
  dateInputButtonContainer: {
    width: '50%',
  },
  dateInputButton: {
    color: theme.static.background.background_accent_3.background,
    padding: theme.spacings.small,
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
