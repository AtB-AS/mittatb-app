import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause} from '@atb/components/accessible-text';
import Button from '@atb/components/button';
import DisappearingHeader from '@atb/components/disappearing-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {useFavorites} from '@atb/favorites';
import {GeoLocation, Location, UserFavorites} from '@atb/favorites/types';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useLocationSearchValue} from '@atb/location-search';
import {SelectableLocationData} from '@atb/location-search/types';
import useTripsQuery from '@atb/screens/Assistant/use-trips-query';
import {useDoOnceWhen} from '@atb/screens/utils';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {
  AssistantTexts,
  dictionary,
  Language,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import {
  coordinatesAreEqual,
  coordinatesDistanceInMetres as distanceInMetres,
  isValidTripLocations,
  LOCATIONS_REALLY_CLOSE_THRESHOLD,
} from '@atb/utils/location';
import {useLayout} from '@atb/utils/use-layout';
import Bugsnag from '@bugsnag/react-native';
import {TFunc} from '@leile/lobo-t';
import analytics from '@react-native-firebase/analytics';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  View,
} from 'react-native';
import Loading from '../Loading';
import FadeBetween from './FadeBetween';
import {SearchTime, useSearchTimeValue} from './journey-date-picker';
import NewsBanner from './NewsBanner';
import Results from './Results';
import {AssistantScreenProps} from './types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type AssistantRouteName = 'AssistantRoot';
const AssistantRouteNameStatic: AssistantRouteName = 'AssistantRoot';

type RootProps = AssistantScreenProps<'AssistantRoot'>;

const AssistantRoot: React.FC<RootProps> = ({navigation}) => {
  const {
    status,
    locationEnabled,
    location,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  if (!status) {
    return <Loading />;
  }

  return (
    <Assistant
      currentLocation={location || undefined}
      hasLocationPermission={locationEnabled && status === 'granted'}
      navigation={navigation}
      requestGeoPermission={requestGeoPermission}
    />
  );
};

type Props = {
  currentLocation?: GeoLocation;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: RootProps['navigation'];
};

const Assistant: React.FC<Props> = ({
  currentLocation,
  hasLocationPermission,
  requestGeoPermission,
  navigation,
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {from, to} = useLocations(currentLocation);
  const {language, t} = useTranslation();
  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);

  useDoOnceWhen(
    () => setUpdatingLocation(true),
    !Boolean(currentLocation) && hasLocationPermission,
  );
  useDoOnceWhen(
    () => setUpdatingLocation(false),
    Boolean(currentLocation) && hasLocationPermission,
  );
  useDoOnceWhen(setCurrentLocationAsFromIfEmpty, Boolean(currentLocation));

  const searchTime = useSearchTimeValue('searchTime', {
    option: 'now',
    date: new Date().toISOString(),
  });

  const setCurrentLocationAsFrom = useCallback(
    function setCurrentLocationAsFrom() {
      log('set_current_location_as_from');
      navigation.setParams({
        fromLocation: currentLocation && {
          ...currentLocation,
          resultType: 'geolocation',
        },
        toLocation: to,
      });
    },
    [navigation, currentLocation, to],
  );

  const setCurrentLocationOrRequest = useCallback(
    async function setCurrentLocationOrRequest() {
      if (currentLocation) {
        setCurrentLocationAsFrom();
      } else {
        const status = await requestGeoPermission();
        if (status === 'granted') {
          setCurrentLocationAsFrom();
        }
      }
    },
    [currentLocation, setCurrentLocationAsFrom, requestGeoPermission],
  );
  const resetView = useCallback(() => {
    analytics().logEvent('click_logo_reset');
    log('reset');
    setCurrentLocationOrRequest();

    navigation.setParams({
      toLocation: undefined,
    });
  }, [navigation, setCurrentLocationOrRequest]);

  function swap() {
    log('swap', {
      newFrom: translateLocation(to),
      newTo: translateLocation(from),
    });
    navigation.setParams({fromLocation: to, toLocation: from});
  }

  function fillNextAvailableLocation(selectedLocation: Location) {
    if (!from) {
      navigation.setParams({
        fromLocation: selectedLocation,
        toLocation: to,
      });
    } else {
      navigation.setParams({
        fromLocation: from,
        toLocation: selectedLocation,
      });
    }
  }

  function setCurrentLocationAsFromIfEmpty() {
    if (from) {
      return;
    }
    setCurrentLocationAsFrom();
  }

  function onSearchTimePress() {
    navigation.navigate('DateTimePicker', {
      callerRouteName: 'AssistantRoot',
      callerRouteParam: 'searchTime',
      searchTime,
    });
  }

  const {tripPatterns, timeOfLastSearch, loadMore, clear, searchState, error} =
    useTripsQuery(from, to, searchTime);

  const isSearching = searchState === 'searching';
  const openLocationSearch = (
    callerRouteParam: keyof RootProps['route']['params'],
    initialLocation: Location | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
      label:
        callerRouteParam === 'fromLocation'
          ? t(AssistantTexts.location.departurePicker.label)
          : t(AssistantTexts.location.destinationPicker.label),
      callerRouteName: AssistantRouteNameStatic,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
    });

  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const useScroll = !showEmptyScreen || !!error;
  const isHeaderFullHeight = !from || !to;

  const renderHeader = useCallback(
    (_) => (
      <View>
        <View style={styles.paddedContainer}>
          <Section>
            <LocationInput
              accessibilityLabel={
                t(AssistantTexts.location.departurePicker.a11yLabel) +
                screenReaderPause
              }
              accessibilityHint={
                t(AssistantTexts.location.departurePicker.a11yHint) +
                screenReaderPause
              }
              updatingLocation={updatingLocation && !to}
              location={from}
              label={t(AssistantTexts.location.departurePicker.label)}
              onPress={() => openLocationSearch('fromLocation', from)}
              icon={<ThemeIcon svg={LocationIcon} />}
              onIconPress={setCurrentLocationOrRequest}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  from?.resultType == 'geolocation'
                    ? t(AssistantTexts.location.locationButton.a11yLabel.update)
                    : t(AssistantTexts.location.locationButton.a11yLabel.use),
                accessibilityRole: 'button',
              }}
              testID="searchFromButton"
            />

            <LocationInput
              accessibilityLabel={t(
                AssistantTexts.location.destinationPicker.a11yLabel,
              )}
              label={t(AssistantTexts.location.destinationPicker.label)}
              location={to}
              onPress={() => openLocationSearch('toLocation', to)}
              icon={<ThemeIcon svg={Swap} />}
              onIconPress={swap}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  t(AssistantTexts.location.swapButton.a11yLabel) +
                  screenReaderPause,
                accessibilityRole: 'button',
              }}
              testID="searchToButton"
            />
          </Section>
        </View>

        <FadeBetween
          duration={400}
          visibleKey={isHeaderFullHeight ? 'favoriteChips' : 'dateInput'}
          preserveHeightFrom={'dateInput'}
        >
          <FavoriteChips
            key="favoriteChips"
            chipTypes={['favorites', 'add-favorite']}
            onSelectLocation={fillNextAvailableLocation}
            containerStyle={styles.fadeChild}
            contentContainerStyle={{
              // @TODO Find solution for not hardcoding this. e.g. do proper math
              paddingLeft: theme.spacings.medium,
              paddingRight: theme.spacings.medium / 2,
            }}
            chipActionHint={
              t(AssistantTexts.favorites.favoriteChip.a11yHint) +
              t(!!from ? dictionary.toPlace : dictionary.fromPlace) +
              screenReaderPause
            }
          />
          <View
            style={[styles.paddedContainer, styles.fadeChild]}
            key="dateInput"
          >
            <Button
              text={getSearchTimeLabel(
                searchTime,
                timeOfLastSearch,
                t,
                language,
              )}
              accessibilityHint={t(AssistantTexts.dateInput.a11yHint)}
              interactiveColor="interactive_0"
              onPress={onSearchTimePress}
              testID="assistantDateTimePicker"
            />
          </View>
        </FadeBetween>
      </View>
    ),
    [
      swap,
      isHeaderFullHeight,
      setCurrentLocationOrRequest,
      from,
      to,
      fillNextAvailableLocation,
    ],
  );

  const {onLayout: onAltLayout, width: altWidth} = useLayout();

  const altHeaderComp = (
    <View accessible={true} onLayout={onAltLayout} style={styles.altTitle}>
      <ThemeText
        type="body__primary--bold"
        style={[
          styles.altTitleText,
          styles.altTitleText__right,
          {maxWidth: altWidth / 2},
        ]}
        numberOfLines={1}
        color={themeColor}
      >
        {from?.name}
      </ThemeText>
      <ThemeText
        type="body__primary--bold"
        accessibilityLabel="til"
        style={styles.altTitleText}
        color={themeColor}
      >
        {' '}
        –{' '}
      </ThemeText>
      <ThemeText
        type="body__primary--bold"
        style={[styles.altTitleText, {maxWidth: altWidth / 2}]}
        numberOfLines={1}
        color={themeColor}
      >
        {to?.name}
      </ThemeText>
    </View>
  );
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);
  const isValidLocations = isValidTripLocations(from, to);

  const onPressed = useCallback(
    (tripPatterns, startIndex) =>
      navigation.navigate('TripDetails', {
        screen: 'Details',
        params: {
          tripPatterns,
          startIndex,
        },
      }),
    [navigation, from, to],
  );

  const newsBanner = <NewsBanner />;

  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  const screenHasFocus = useIsFocused();

  const {leftButton} = useServiceDisruptionSheet();

  useEffect(() => {
    if (!screenHasFocus) return;
    switch (searchState) {
      case 'searching':
        setSearchStateMessage(t(AssistantTexts.searchState.searching));
        break;
      case 'search-success':
        setSearchStateMessage(t(AssistantTexts.searchState.searchSuccess));
        break;
      case 'search-empty-result':
        setSearchStateMessage(t(AssistantTexts.searchState.searchEmptyResult));
        break;
      default:
        setSearchStateMessage('');
        break;
    }
  }, [searchState]);

  // Reset view on back press instead of exiting app
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (screenHasFocus && from && to) {
          resetView();
          return true; // prevent default action
        }
        return false;
      },
    );
    return () => backHandler.remove();
  });

  const refresh = () => {
    navigation.setParams({
      fromLocation: from?.resultType === 'geolocation' ? currentLocation : from,
      toLocation: to?.resultType === 'geolocation' ? currentLocation : to,
    });
  };

  useEffect(refresh, [from, to]);

  return (
    <DisappearingHeader
      renderHeader={renderHeader}
      highlightComponent={newsBanner}
      onRefresh={refresh}
      isRefreshing={searchState === 'searching' && !tripPatterns.length}
      useScroll={useScroll}
      headerTitle={t(AssistantTexts.header.title)}
      isFullHeight={isHeaderFullHeight}
      alternativeTitleComponent={altHeaderComp}
      showAlterntativeTitle={Boolean(from && to)}
      leftButton={leftButton}
      tabPressBehaviour={{navigation, onTabPressOnTopScroll: resetView}}
      onFullscreenTransitionEnd={(fullHeight) => {
        if (fullHeight) {
          clear();
        }
      }}
      globalMessageContext="app-assistant"
    >
      <ScreenReaderAnnouncement message={searchStateMessage} />
      {from && to && (
        <Results
          tripPatterns={tripPatterns}
          isSearching={isSearching}
          showEmptyScreen={showEmptyScreen}
          isEmptyResult={isEmptyResult}
          resultReasons={noResultReasons}
          onDetailsPressed={onPressed}
          errorType={error}
          searchTime={searchTime}
        />
      )}
      {!error && isValidLocations && (
        <TouchableOpacity
          onPress={loadMore}
          disabled={searchState === 'searching'}
          style={styles.loadMoreButton}
          testID="loadMoreButton"
        >
          {searchState === 'searching' ? (
            <View style={styles.loadingIndicator}>
              {tripPatterns.length ? (
                <>
                  <ActivityIndicator
                    color={theme.text.colors.secondary}
                    style={{
                      marginRight: theme.spacings.medium,
                    }}
                  />
                  <ThemeText color="secondary" testID="searchingForResults">
                    {t(AssistantTexts.results.fetchingMore)}
                  </ThemeText>
                </>
              ) : (
                <ThemeText
                  color="secondary"
                  style={styles.loadingText}
                  testID="searchingForResults"
                >
                  {t(AssistantTexts.searchState.searching)}
                </ThemeText>
              )}
            </View>
          ) : (
            <>
              {loadMore ? (
                <>
                  <ThemeText testID="resultsLoaded">
                    {t(AssistantTexts.results.fetchMore)}{' '}
                  </ThemeText>
                  <ThemeIcon svg={ExpandMore} size={'normal'} />
                </>
              ) : null}
            </>
          )}
        </TouchableOpacity>
      )}
    </DisappearingHeader>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacings.medium,
  },
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  styleButton: {
    flexGrow: 1,
  },
  altTitle: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  altTitleText: {
    overflow: 'hidden',
  },
  altTitleText__right: {
    textAlign: 'right',
  },
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  fadeChild: {
    marginVertical: theme.spacings.medium,
  },
  loadingIndicator: {
    marginTop: theme.spacings.xLarge,
    flexDirection: 'row',
  },
  loadingText: {
    marginTop: theme.spacings.xLarge * 2,
  },
  loadMoreButton: {
    paddingVertical: theme.spacings.medium,
    marginBottom: theme.spacings.xLarge,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
}));

type SearchForLocations = {
  from?: Location;
  to?: Location;
};

function computeNoResultReasons(
  t: TFunc<typeof Language>,
  date?: SearchTime,
  from?: Location,
  to?: Location,
): String[] {
  let reasons = [];

  if (!!from && !!to) {
    if (coordinatesAreEqual(from.coordinates, to.coordinates)) {
      reasons.push(
        t(AssistantTexts.searchState.noResultReason.IdenticalLocations),
      );
    } else if (
      distanceInMetres(from.coordinates, to.coordinates) <
      LOCATIONS_REALLY_CLOSE_THRESHOLD
    ) {
      reasons.push(t(AssistantTexts.searchState.noResultReason.CloseLocations));
    }
  }

  const isPastDate = date && date?.option !== 'now' && isInThePast(date.date);

  if (isPastDate) {
    const isArrival = date?.option === 'arrival';
    const dateReason = isArrival
      ? t(AssistantTexts.searchState.noResultReason.PastArrivalTime)
      : t(AssistantTexts.searchState.noResultReason.PastDepartureTime);
    reasons.push(dateReason);
  }
  return reasons;
}

function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<GeoLocation | undefined>(
    () => currentLocation,
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const searchedFromLocation =
    useLocationSearchValue<RootProps['route']>('fromLocation');
  const searchedToLocation =
    useLocationSearchValue<RootProps['route']>('toLocation');

  return useUpdatedLocation(
    searchedFromLocation,
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );
}

function useUpdatedLocation(
  searchedFromLocation: SelectableLocationData | undefined,
  searchedToLocation: SelectableLocationData | undefined,
  currentLocation: GeoLocation | undefined,
  favorites: UserFavorites,
): SearchForLocations {
  const [from, setFrom] = useState<Location | undefined>();
  const [to, setTo] = useState<Location | undefined>();
  const navigation = useNavigation<RootProps['navigation']>();

  const setLocation = useCallback(
    (direction: 'from' | 'to', searchedLocation?: SelectableLocationData) => {
      const updater = direction === 'from' ? setFrom : setTo;
      if (!searchedLocation) return updater(searchedLocation);

      switch (searchedLocation.resultType) {
        case 'search':
        case 'geolocation':
          return updater(searchedLocation);
        case 'journey': {
          const toSearch = (i: number): Location => ({
            ...searchedLocation.journeyData[i],
            resultType: 'search',
          });

          // Set both states when journey is passed.
          navigation.setParams({
            fromLocation: toSearch(0),
            toLocation: toSearch(1),
          });
          return;
        }
        case 'favorite': {
          const favorite = favorites.find(
            (f) => f.id === searchedLocation.favoriteId,
          );

          if (favorite) {
            return updater(favorite.location);
          }
        }
      }
    },
    [currentLocation, favorites],
  );

  // Override from state on change
  useEffect(() => {
    setLocation('from', searchedFromLocation);
  }, [searchedFromLocation, setLocation]);

  // Override to state on change
  useEffect(() => {
    setLocation('to', searchedToLocation);
  }, [searchedToLocation, setLocation]);

  return {from, to};
}

export default AssistantRoot;

function log(message: string, metadata?: {[key: string]: string}) {
  Bugsnag.leaveBreadcrumb(message, {component: 'Assistant', ...metadata});
}

function translateLocation(location: Location | undefined): string {
  if (!location) return 'Undefined location';
  if (location.resultType === 'geolocation') {
    return location.id;
  }
  return `${location.id}--${location.name}--${location.locality}`;
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
      return t(AssistantTexts.dateInput.departureNow(time));
    case 'arrival':
      return t(AssistantTexts.dateInput.arrival(time));
    case 'departure':
      return t(AssistantTexts.dateInput.departure(time));
  }
  return time;
}
