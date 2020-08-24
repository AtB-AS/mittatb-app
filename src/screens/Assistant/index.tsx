import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {searchTrip} from '../../api';
import {CancelToken, isCancel} from '../../api/client';
import {Swap} from '../../assets/svg/icons/actions';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import DisappearingHeader from '../../components/disappearing-header/index ';
import {LocationButton} from '../../components/search-button';
import SearchGroup from '../../components/search-button/search-group';
import {useFavorites} from '../../favorites/FavoritesContext';
import {Location, UserFavorites} from '../../favorites/types';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '../../GeolocationContext';
import {
  LocationWithSearchMetadata,
  useLocationSearchValue,
} from '../../location-search';
import {useReverseGeocoder} from '../../location-search/useGeocoder';
import {RootStackParamList} from '../../navigation';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import {TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import {useLayout} from '../../utils/use-layout';
import Loading from '../Loading';
import DateInput, {DateOutput} from './DateInput';
import Results from './Results';

type AssistantRouteName = 'Assistant';
const AssistantRouteNameStatic: AssistantRouteName = 'Assistant';

export type AssistantScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, AssistantRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type AssistantRouteProp = RouteProp<TabNavigatorParams, AssistantRouteName>;

type RootProps = {
  navigation: AssistantScreenNavigationProp;
  route: AssistantRouteProp;
};

const AssistantRoot: React.FC<RootProps> = ({navigation}) => {
  const {
    status,
    location,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const reverseLookupLocations = useReverseGeocoder(location) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Loading />;
  }

  return (
    <Assistant
      currentLocation={currentLocation}
      navigation={navigation}
      requestGeoPermission={requestGeoPermission}
    />
  );
};

type Props = {
  currentLocation?: Location;
  requestGeoPermission: RequestPermissionFn;
  navigation: AssistantScreenNavigationProp;
};

const HEADER_HEIGHT = 157;

const Assistant: React.FC<Props> = ({
  currentLocation,
  requestGeoPermission,
  navigation,
}) => {
  const {from, to} = useLocations(currentLocation);

  function swap() {
    navigation.setParams({fromLocation: to, toLocation: from});
  }

  function setCurrentLocationAsFrom() {
    navigation.setParams({
      fromLocation: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
      toLocation: to,
    });
  }

  useDoOnceWhen(setCurrentLocationAsFrom, Boolean(currentLocation));

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

  const [date, setDate] = useState<DateOutput | undefined>();
  const [tripPatterns, isSearching, timeOfLastSearch, reload] = useTripPatterns(
    from,
    to,
    date,
  );

  const openLocationSearch = (
    callerRouteParam: keyof AssistantRouteProp['params'],
    initialText: string | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
      label: callerRouteParam === 'fromLocation' ? 'Fra' : 'Til',
      callerRouteName: AssistantRouteNameStatic,
      callerRouteParam,
      initialText,
    });

  const showEmptyScreen = !tripPatterns && !isSearching;
  const isEmptyResult = !isSearching && !tripPatterns?.length;
  const useScroll = !showEmptyScreen && !isEmptyResult;

  const renderHeader = () => (
    <View>
      <SearchGroup>
        <View style={styles.searchButtonContainer}>
          <View style={styles.styleButton}>
            <LocationButton
              accessible={true}
              accessibilityLabel="Velg avreisested."
              accessibilityRole="button"
              title="Fra"
              placeholder="Søk etter adresse eller sted"
              location={from}
              onPress={() => openLocationSearch('fromLocation', from?.name)}
            />
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Bruk min posisjon som avreisested."
            accessibilityRole="button"
            hitSlop={insets.all(12)}
            onPress={setCurrentLocationOrRequest}
          >
            <CurrentLocationArrow />
          </TouchableOpacity>
        </View>

        <View style={styles.searchButtonContainer}>
          <View style={styles.styleButton}>
            <LocationButton
              accessible={true}
              accessibilityLabel="Velg ankomststed."
              accessibilityRole="button"
              title="Til"
              placeholder="Søk etter adresse eller sted"
              location={to}
              onPress={() => openLocationSearch('toLocation', to?.name)}
            />
          </View>

          <TouchableOpacity
            hitSlop={insets.all(12)}
            onPress={swap}
            accessible={true}
            accessibilityLabel="Bytt om på avreisested og ankomststed"
            accessibilityRole="button"
          >
            <Swap />
          </TouchableOpacity>
        </View>
      </SearchGroup>

      <SearchGroup containerStyle={{marginTop: 12}}>
        <DateInput
          onDateSelected={setDate}
          value={date}
          timeOfLastSearch={timeOfLastSearch}
        />
      </SearchGroup>
    </View>
  );

  const {onLayout: onAltLayout, width: altWidth} = useLayout();

  const altHeaderComp = (
    <View accessible={true} onLayout={onAltLayout} style={styles.altTitle}>
      <Text
        style={[
          styles.altTitleText,
          styles.altTitleText__right,
          {maxWidth: altWidth / 2},
        ]}
        numberOfLines={1}
      >
        {from?.name}
      </Text>
      <Text accessibilityLabel="til" style={styles.altTitleText}>
        {' '}
        –{' '}
      </Text>
      <Text
        style={[styles.altTitleText, {maxWidth: altWidth / 2}]}
        numberOfLines={1}
      >
        {to?.name}
      </Text>
    </View>
  );

  return (
    <DisappearingHeader
      renderHeader={renderHeader}
      onRefresh={reload}
      isRefreshing={isSearching}
      headerHeight={HEADER_HEIGHT}
      useScroll={useScroll}
      headerTitle="Reiseassistent"
      alternativeTitleComponent={altHeaderComp}
    >
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        showEmptyScreen={showEmptyScreen}
        isEmptyResult={isEmptyResult}
        onDetailsPressed={(tripPattern) =>
          navigation.navigate('TripDetailsModal', {
            from: from!,
            to: to!,
            tripPatternId: tripPattern.id!,
            tripPattern: tripPattern,
          })
        }
      />
    </DisappearingHeader>
  );
};
const styles = StyleSheet.create({
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  altTitleText__right: {
    textAlign: 'right',
  },
});

type Locations = {
  from: LocationWithSearchMetadata | undefined;
  to: LocationWithSearchMetadata | undefined;
};

function useLocations(currentLocation: Location | undefined): Locations {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<LocationWithSearchMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const searchedFromLocation = useLocationSearchValue<AssistantRouteProp>(
    'fromLocation',
  );
  const searchedToLocation = useLocationSearchValue<AssistantRouteProp>(
    'toLocation',
  );

  const from = useUpdatedLocation(
    searchedFromLocation,
    memoedCurrentLocation,
    favorites,
  );

  const to = useUpdatedLocation(
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );

  return {
    from,
    to,
  };
}

function useUpdatedLocation(
  searchedLocation: LocationWithSearchMetadata | undefined,
  currentLocation: LocationWithSearchMetadata | undefined,
  favorites: UserFavorites,
): LocationWithSearchMetadata | undefined {
  return useMemo(() => {
    if (!searchedLocation) return undefined;

    switch (searchedLocation.resultType) {
      case 'search':
        return searchedLocation;
      case 'geolocation':
        return currentLocation;
      case 'favorite':
        const favorite = favorites.find(
          (f) => f.id === searchedLocation.favoriteId,
        );

        if (favorite) {
          return {
            ...favorite.location,
            resultType: 'favorite',
            favoriteId: favorite.id,
          };
        }
    }

    return undefined;
  }, [searchedLocation, currentLocation, favorites]);
}

export default AssistantRoot;

function useTripPatterns(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
  date: DateOutput | undefined,
): [TripPattern[] | null, boolean, Date, () => {}] {
  const [isSearching, setIsSearching] = useState(false);
  const [timeOfSearch, setTimeOfSearch] = useState<Date>(new Date());
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);

  const reload = useCallback(() => {
    const source = CancelToken.source();

    async function search() {
      if (!fromLocation || !toLocation) return;

      setIsSearching(true);
      try {
        const arriveBy = date?.type === 'arrival';
        const searchDate =
          date && date?.type !== 'now' ? date.date : new Date();
        const response = await searchTrip(
          fromLocation,
          toLocation,
          searchDate,
          arriveBy,
          {
            cancelToken: source.token,
          },
        );
        source.token.throwIfRequested();
        setTripPatterns(response.data);
        setIsSearching(false);
        setTimeOfSearch(searchDate);
      } catch (e) {
        if (!isCancel(e)) {
          console.warn(e);
          setTripPatterns(null);
          setIsSearching(false);
        }
      }
    }

    search();
    return () => {
      if (!fromLocation || !toLocation) return;
      source.cancel('New search to replace previous search');
    };
  }, [fromLocation, toLocation, date]);

  useEffect(reload, [reload]);

  return [tripPatterns, isSearching, timeOfSearch, reload];
}

function useDoOnceWhen(fn: () => void, condition: boolean) {
  const firstTimeRef = useRef(true);
  useEffect(() => {
    if (firstTimeRef.current && condition) {
      firstTimeRef.current = false;
      fn();
    }
  }, [condition]);
}
