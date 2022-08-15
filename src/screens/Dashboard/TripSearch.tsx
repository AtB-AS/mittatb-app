import FullScreenHeader from '@atb/components/screen-header/full-header';

import navigation, {RootStackParamList} from '@atb/navigation';

import {StyleSheet, useTheme} from '@atb/theme';
import {
  AssistantTexts,
  DashboardTexts,
  dictionary,
  Language,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';

import {
  CompositeNavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import Button from '@atb/components/button';
import {ScrollView} from 'react-native-gesture-handler';
import {AssistantParams} from '../Assistant';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {LocationInput, Section} from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/accessible-text';
import {GeoLocation, Location, UserFavorites} from '@atb/favorites/types';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {useFavorites} from '@atb/favorites';
import {useLocationSearchValue} from '@atb/location-search';
import FadeBetween from '../Assistant/FadeBetween';
import {useGeolocationState} from '@atb/GeolocationContext';
import {DashboardParams} from '.';
import {SelectableLocationData} from '@atb/location-search/types';
import {AssistantScreenNavigationProp} from '../Assistant/Assistant';
import Bugsnag from '@bugsnag/react-native';
import {SearchTime, useSearchTimeValue} from '../Assistant/journey-date-picker';
import {TFunc} from '@leile/lobo-t';
import {formatToLongDateTime, isInThePast} from '@atb/utils/date';
import useTripsQuery from '../Assistant/use-trips-query';
import {StaticColorByType} from '@atb/theme/colors';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import Results from '../Assistant/Results';
import {
  coordinatesAreEqual,
  coordinatesDistanceInMetres,
  LOCATIONS_REALLY_CLOSE_THRESHOLD,
} from '@atb/utils/location';

type TripSearchRouteName = 'TripSearch';
const TripSearchRouteNameStatic: TripSearchRouteName = 'TripSearch';

export type TripSearchScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DashboardParams>,
  StackNavigationProp<RootStackParamList>
>;

type TripSearchRouteProp = RouteProp<DashboardParams, TripSearchRouteName>;

type RootProps = {
  navigation: TripSearchScreenNavigationProp;
  route: TripSearchRouteProp;
};

type SearchForLocations = {
  from?: Location;
  to?: Location;
};

const headerBackgroundColor: StaticColorByType<'background'> =
  'background_accent_0';

const ResultsBackgroundColor: StaticColorByType<'background'> = 'background_1';

const TripSearch: React.FC<RootProps> = ({navigation}) => {
  const style = useStyle();
  const {theme} = useTheme();
  const {language, t} = useTranslation();
  const {leftButton: serviceDisruptionButton} = useServiceDisruptionSheet();
  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);

  const {
    status,
    locationEnabled,
    location,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const currentLocation = location || undefined;

  const {from, to} = useLocations(currentLocation);
  const searchTime = useSearchTimeValue('searchTime', {
    option: 'now',
    date: new Date().toISOString(),
  });
  const {tripPatterns, timeOfLastSearch, loadMore, clear, searchState, error} =
    useTripsQuery(from, to, searchTime);

  const isSearching = searchState === 'searching';
  const showEmptyScreen = !tripPatterns && !isSearching && !error;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const noResultReasons = computeNoResultReasons(t, searchTime, from, to);

  const [searchStateMessage, setSearchStateMessage] = useState<
    string | undefined
  >();

  const screenHasFocus = useIsFocused();

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

  const openLocationSearch = (
    callerRouteParam: keyof TripSearchRouteProp['params'],
    initialLocation: Location | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
      label:
        callerRouteParam === 'fromLocation'
          ? t(AssistantTexts.location.departurePicker.label)
          : t(AssistantTexts.location.destinationPicker.label),
      callerRouteName: TripSearchRouteNameStatic,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
    });

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

  const onPressed = useCallback(
    (tripPatterns, startIndex) =>
      navigation.navigate('TripDetails', {
        tripPatterns,
        startIndex,
      }),
    [navigation, from, to],
  );

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
  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(TripSearchTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{
          type: 'back',
          onPress: () => {
            navigation.navigate('DashboardRoot', {
              toLocation: undefined,
              fromLocation: undefined,
              searchTime: undefined,
            });
          },
        }}
      />

      <View style={style.searchHeader}>
        <View style={style.paddedContainer}>
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

        <FavoriteChips
          key="favoriteChips"
          chipTypes={['favorites', 'add-favorite']}
          onSelectLocation={fillNextAvailableLocation}
          containerStyle={style.fadeChild}
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
      </View>

      <ScrollView contentContainerStyle={style.scrollView}>
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
      </ScrollView>
    </View>
  );
};
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
    useLocationSearchValue<TripSearchRouteProp>('fromLocation');
  const searchedToLocation =
    useLocationSearchValue<TripSearchRouteProp>('toLocation');

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
  const navigation = useNavigation<AssistantScreenNavigationProp>();

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
      coordinatesDistanceInMetres(from.coordinates, to.coordinates) <
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

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[ResultsBackgroundColor].background,
    flex: 1,
  },
  scrollView: {
    paddingBottom: theme.spacings.medium,
    backgroundColor: theme.static.background[ResultsBackgroundColor].background,
  },
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  fadeChild: {
    marginVertical: theme.spacings.medium,
  },
  searchHeader: {
    backgroundColor: theme.static.background[headerBackgroundColor].background,
  },
}));

export default TripSearch;