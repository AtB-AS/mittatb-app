import React, {useEffect, useState, useMemo} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Results from './Results';
import {TripPattern} from '../../sdk';
import {useGeolocationState} from '../../GeolocationContext';
import Splash from '../Splash';
import {StyleSheet} from '../../theme';
import {searchTrip} from '../../api';
import {Location, UserFavorites} from '../../favorites/types';
import {
  useLocationSearchValue,
  LocationWithSearchMetadata,
} from '../../location-search';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/core';
import {RootStackParamList} from '../../navigation';
import {SharedElement} from 'react-navigation-shared-element';
import Header from '../../ScreenHeader';
import {useReverseGeocoder} from '../../location-search/useGeocoder';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import SearchButton from '../../components/search-button';
import SearchLocationIcon from '../../components/search-location-icon';
import {useFavorites} from '../../favorites/FavoritesContext';

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

  const {from, to} = useLocations(currentLocation);

  const fromIcon = <SearchLocationIcon location={from} />;
  const toIcon = <SearchLocationIcon location={to} />;

  const [tripPatterns, isSearching] = useTripPatterns(from, to);

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
      <Header>Reiseassistent</Header>
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Fra"
          placeholder="Søk etter adresse eller sted"
          location={from}
          icon={fromIcon}
          onPress={() => openLocationSearch('fromLocation', from?.name)}
        />
      </SharedElement>
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        navigation={navigation}
        onDetailsPressed={tripPattern =>
          navigation.navigate('TripDetailsModal', {
            from: from!,
            to: to!,
            tripPattern,
          })
        }
      />
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Til"
          placeholder="Søk etter adresse eller sted"
          location={to}
          icon={toIcon}
          onPress={() => openLocationSearch('toLocation', to?.name)}
        />
      </SharedElement>
    </SafeAreaView>
  );
};

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
    from: from ?? memoedCurrentLocation,
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
          f => f.id === searchedLocation.favoriteId,
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

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
  },
}));

export default AssistantRoot;

function useTripPatterns(
  fromLocation: Location | undefined,
  toLocation: Location | undefined,
): [TripPattern[] | null, boolean] {
  const [isSearching, setIsSearching] = useState(false);
  const [tripPatterns, setTripPatterns] = useState<TripPattern[] | null>(null);

  async function search() {
    if (!fromLocation || !toLocation) return;
    setIsSearching(true);
    try {
      const response = await searchTrip(fromLocation, toLocation);
      setTripPatterns(response.data);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    search();
  }, [fromLocation, toLocation]);

  return [tripPatterns, isSearching];
}
