import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {View, Animated, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {searchTrip} from '../../api';
import {CancelToken, isCancel} from '../../api/client';
import {Swap} from '../../assets/svg/icons/actions';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import useChatIcon from '../../chat/use-chat-icon';
import {LocationButton} from '../../components/search-button';
import SearchGroup from '../../components/search-button/search-group';
import {useFavorites} from '../../favorites/FavoritesContext';
import {Location, UserFavorites} from '../../favorites/types';
import {
  useGeolocationState,
  RequestPermissionFn,
} from '../../GeolocationContext';
import {
  LocationWithSearchMetadata,
  useLocationSearchValue,
} from '../../location-search';
import {useReverseGeocoder} from '../../location-search/useGeocoder';
import {RootStackParamList} from '../../navigation';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import Header from '../../ScreenHeader';
import {TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
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
  const styles = useThemeStyles();

  const {from, to} = useLocations(currentLocation);

  const scrollYRef = useRef(
    new Animated.Value(Platform.OS === 'ios' ? -HEADER_HEIGHT : 0),
  ).current;

  const scrollY = Animated.add(
    scrollYRef,
    Platform.OS === 'ios' ? HEADER_HEIGHT : 0,
  );
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

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
      const status = await requestGeoPermission({useSettingsFallback: true});
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

  const {icon: chatIcon, openChat} = useChatIcon();
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reiseassistent"
        rightButton={{onPress: openChat, icon: chatIcon}}
      />

      <View style={styles.content}>
        <Animated.View
          style={[styles.header, {transform: [{translateY: headerTranslate}]}]}
        >
          <SearchGroup>
            <View style={styles.searchButtonContainer}>
              <View style={styles.styleButton}>
                <LocationButton
                  title="Fra"
                  placeholder="Søk etter adresse eller sted"
                  location={from}
                  onPress={() => openLocationSearch('fromLocation', from?.name)}
                />
              </View>

              <TouchableOpacity
                style={styles.clickableIcon}
                hitSlop={insets.all(12)}
                onPress={setCurrentLocationOrRequest}
              >
                <CurrentLocationArrow />
              </TouchableOpacity>
            </View>

            <View style={styles.searchButtonContainer}>
              <View style={styles.styleButton}>
                <LocationButton
                  title="Til"
                  placeholder="Søk etter adresse eller sted"
                  location={to}
                  onPress={() => openLocationSearch('toLocation', to?.name)}
                />
              </View>

              <TouchableOpacity
                style={styles.clickableIcon}
                hitSlop={insets.all(12)}
                onPress={swap}
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
        </Animated.View>

        <Results
          tripPatterns={tripPatterns}
          isSearching={isSearching}
          navigation={navigation}
          onRefresh={reload}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
            {useNativeDriver: true},
          )}
          style={{paddingTop: Platform.OS !== 'ios' ? HEADER_HEIGHT : 0}}
          offsetTop={HEADER_HEIGHT}
          onDetailsPressed={(tripPattern) =>
            navigation.navigate('TripDetailsModal', {
              from: from!,
              to: to!,
              tripPatternId: tripPattern.id!,
              tripPattern: tripPattern,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: HEADER_HEIGHT,
    zIndex: 2,
    elevated: 1,
  },
  container: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
  },
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleButton: {
    flexGrow: 1,
  },
  clickableIcon: {},
}));

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
        return currentLocation ?? searchedLocation;
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
