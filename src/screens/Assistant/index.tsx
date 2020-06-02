import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';
import {searchTrip} from '../../api';
import {CancelToken, isCancel} from '../../api/client';
import LocationArrow from '../../assets/svg/LocationArrow';
import SwapLocationsArrowIcon from '../../assets/svg/SwapLocationsArrowsIcon';
import {LocationButton} from '../../components/search-button';
import SearchGroup from '../../components/search-button/search-group';
import {useFavorites} from '../../favorites/FavoritesContext';
import {Location, UserFavorites} from '../../favorites/types';
import {useGeolocationState} from '../../GeolocationContext';
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
import Splash from '../Splash';
import Results from './Results';
<<<<<<< HEAD
import useChatIcon from '../../utils/use-chat-icon';
=======
import DateInput, {DateOutput} from './DateInput';
>>>>>>> 57de59e... feat(assistant): Adds ability to input date time (arrival and departure)

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
  const {status, location} = useGeolocationState();

  const reverseLookupLocations = useReverseGeocoder(location) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Splash />;
  }

  return (
    <Assistant currentLocation={currentLocation} navigation={navigation} />
  );
};

type Props = {
  currentLocation?: Location;
  navigation: AssistantScreenNavigationProp;
};

const Assistant: React.FC<Props> = ({currentLocation, navigation}) => {
  const styles = useThemeStyles();

  const {from, to, swap, setCurrentLocationAsFrom} = useLocations(
    currentLocation,
  );
  const [date, setDate] = useState<DateOutput | undefined>();
  const [tripPatterns, isSearching, reload] = useTripPatterns(from, to, date);

  const {icon: chatIcon, openChat} = useChatIcon();
  const openLocationSearch = (
    callerRouteParam: keyof AssistantRouteProp['params'],
    initialText: string | undefined,
  ) =>
    navigation.navigate('LocationSearch', {
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
      <SearchGroup>
        <View style={styles.searchButtonContainer}>
          <SharedElement style={styles.styleButton} id="locationSearchInput">
            <LocationButton
              title="Fra"
              placeholder="Søk etter adresse eller sted"
              location={from}
              onPress={() => openLocationSearch('fromLocation', from?.name)}
            />
          </SharedElement>

          <TouchableOpacity
            style={styles.clickableIcon}
            hitSlop={insets.all(12)}
            onPress={setCurrentLocationAsFrom}
          >
            <LocationArrow />
          </TouchableOpacity>
        </View>

        <View style={styles.searchButtonContainer}>
          <SharedElement id="locationSearchInput" style={styles.styleButton}>
            <LocationButton
              title="Til"
              placeholder="Søk etter adresse eller sted"
              location={to}
              onPress={() => openLocationSearch('toLocation', to?.name)}
            />
          </SharedElement>

          <TouchableOpacity
            style={styles.clickableIcon}
            hitSlop={insets.all(12)}
            onPress={swap}
          >
            <SwapLocationsArrowIcon />
          </TouchableOpacity>
        </View>
      </SearchGroup>

      <SearchGroup containerStyle={{marginTop: 12}}>
        <DateInput onDateSelected={setDate} value={date} />
      </SearchGroup>

      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        navigation={navigation}
        onRefresh={reload}
        onDetailsPressed={(tripPattern) =>
          navigation.navigate('TripDetailsModal', {
            from: from!,
            to: to!,
            tripPatternId: tripPattern.id!,
          })
        }
      />
    </SafeAreaView>
  );
};
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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

type LocationHookData = Locations & {
  swap(): void;
  setCurrentLocationAsFrom(): void;
};

function useLocations(currentLocation: Location | undefined): LocationHookData {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<LocationWithSearchMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const [stored, updateFromTo] = useState<Locations>({
    from: memoedCurrentLocation,
    to: undefined,
  });

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

  useEffect(
    function () {
      updateFromTo({
        from: from ?? stored.from ?? memoedCurrentLocation,
        to: to ?? stored.to,
      });
    },
    [from, to, memoedCurrentLocation],
  );

  const swap = () =>
    updateFromTo({
      to: stored.from,
      from: stored.to,
    });

  const setCurrentLocationAsFrom = () =>
    updateFromTo({
      from: memoedCurrentLocation,
      to: stored.to,
    });

  return {
    from: stored.from,
    to: stored.to,
    swap,
    setCurrentLocationAsFrom,
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
): [TripPattern[] | null, boolean, () => {}] {
  const [isSearching, setIsSearching] = useState(false);
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);

  const reload = useCallback(() => {
    const source = CancelToken.source();

    async function search() {
      if (!fromLocation || !toLocation) return;

      setIsSearching(true);
      try {
        const arriveBy = date?.type === 'arrival';
        const searchDate = date?.type === 'now' ? new Date() : date?.date;
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

  return [tripPatterns, isSearching, reload];
}
