import React, {useEffect, useReducer, useMemo, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Results from './Results';
import {useAppState} from '../../../AppContext';
import {TripPattern} from '../../../sdk';
import {PlannerStackParams} from '../';
import {useGeolocationState} from '../../../GeolocationContext';
import Splash from '../../Splash';
import {StyleSheet, useStyle} from '../../../theme';
import {searchTrip} from '../../../api';
import {UserFavorites, Location} from '../../../favorites/types';
import {
  useLocationSearchValue,
  LocationWithSearchMetadata,
} from '../../../location-search';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/core';
import SearchButton from './SearchButton';
import {RootStackParamList} from '../../../navigation';
import {SharedElement} from 'react-navigation-shared-element';
import Header from './Header';
import {useReverseGeocoder} from '../../../location-search/useGeocoder';
import {useFavorites} from '../../../favorites/FavoritesContext';
import LocationArrow from '../../../assets/svg/LocationArrow';
import {Text} from 'react-native';
import LocationIcon from '../../../assets/svg/LocationIcon';

type AssistantRouteName = 'Assistant';
const AssistantRouteNameStatic: AssistantRouteName = 'Assistant';

export type AssistantScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PlannerStackParams, AssistantRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type AssistantRouteProp = RouteProp<PlannerStackParams, AssistantRouteName>;

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

  const {favorites} = useFavorites();

  const searchedFromLocation = useLocationSearchValue<AssistantRouteProp>(
    'fromLocation',
  );
  const searchedToLocation = useLocationSearchValue<AssistantRouteProp>(
    'toLocation',
  );

  const currentSearchLocation = useMemo<LocationWithSearchMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );

  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const fromIcon =
    fromLocation && getSearchedLocationIcon(fromLocation, favorites);
  const toLocation = searchedToLocation;
  const toIcon = toLocation && getSearchedLocationIcon(toLocation, favorites);

  const [tripPatterns, isSearching] = useTripPatterns(fromLocation, toLocation);

  const openLocationSearch = (
    callerRouteParam: keyof AssistantRouteProp['params'],
  ) =>
    navigation.navigate('LocationSearch', {
      callerRouteName: AssistantRouteNameStatic,
      callerRouteParam,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header>Reiseassistent</Header>
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Fra"
          placeholder="Søk etter adresse eller sted"
          location={fromLocation}
          icon={fromIcon}
          onPress={() => openLocationSearch('fromLocation')}
        />
      </SharedElement>
      <Results
        tripPatterns={tripPatterns}
        isSearching={isSearching}
        navigation={navigation}
      />
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Til"
          placeholder="Søk etter adresse eller sted"
          location={toLocation}
          icon={toIcon}
          onPress={() => openLocationSearch('toLocation')}
        />
      </SharedElement>
    </SafeAreaView>
  );
};

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

const getSearchedLocationIcon = (
  location: LocationWithSearchMetadata,
  favorites: UserFavorites,
): JSX.Element => {
  switch (location.resultType) {
    case 'geolocation':
      return <LocationArrow />;
    case 'favorite':
      return (
        <Text>
          {favorites.find(f => f.name === location.favoriteName)?.emoji}
        </Text>
      );
    case 'search':
      return <LocationIcon location={location} />;
  }
};
