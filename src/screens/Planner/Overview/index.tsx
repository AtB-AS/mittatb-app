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
import {SvgProps} from 'react-native-svg';
import {Text} from 'react-native';
import LocationIcon from '../../../assets/svg/LocationIcon';
import InputSearchIcon from '../../../location-search/svg/InputSearchIcon';

type AssistantState = {
  isSearching: boolean;
  tripPatterns: TripPattern[] | null;
  fromLocation?: Location;
  fromIcon: JSX.Element;
  toLocation?: Location;
  toIcon: JSX.Element;
};

export type AssistantReducerAction =
  | {type: 'SET_TRIP_PATTERNS'; tripPatterns: TripPattern[] | null}
  | {type: 'SET_IS_SEARCHING'}
  | {
      type: 'SET_FROM_LOCATION';
      location: Location;
      icon: JSX.Element;
    }
  | {
      type: 'SET_TO_LOCATION';
      location: Location;
      icon: JSX.Element;
    };

type AssistantReducer = (
  prevState: AssistantState,
  action: AssistantReducerAction,
) => AssistantState;

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

const AssistantReducer: AssistantReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_TRIP_PATTERNS':
      return {
        ...prevState,
        tripPatterns: action.tripPatterns,
        isSearching: false,
      };
    case 'SET_IS_SEARCHING':
      return {
        ...prevState,
        isSearching: true,
      };
    case 'SET_FROM_LOCATION':
      return {
        ...prevState,
        fromLocation: action.location,
        fromIcon: action.icon,
      };
    case 'SET_TO_LOCATION':
      return {
        ...prevState,
        toLocation: action.location,
        toIcon: action.icon,
      };
  }
};

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
  const {userLocations} = useAppState();
  const {status, location} = useGeolocationState();

  const reverseLookupLocations = useReverseGeocoder(location) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : null;

  if (!userLocations || !status) {
    return <Splash />;
  }

  return (
    <Assistant
      userLocations={userLocations}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
};

type Props = {
  currentLocation: Location | null;
  userLocations: UserFavorites;
  navigation: AssistantScreenNavigationProp;
};

const Assistant: React.FC<Props> = ({
  currentLocation,
  userLocations,
  navigation,
}) => {
  const [
    {tripPatterns, isSearching, fromLocation, fromIcon, toLocation, toIcon},
    dispatch,
  ] = useReducer<AssistantReducer>(AssistantReducer, {
    tripPatterns: null,
    isSearching: false,
    fromLocation: currentLocation ?? undefined,
    fromIcon: currentLocation ? <LocationArrow /> : <InputSearchIcon />,
    toLocation: undefined,
    toIcon: <InputSearchIcon />,
  });

  const {favorites} = useFavorites();

  const styles = useThemeStyles();

  const searchedFromLocation = useLocationSearchValue<AssistantRouteProp>(
    'fromLocation',
  );
  useEffect(() => {
    if (searchedFromLocation) {
      const icon = getSearchedLocationIcon(searchedFromLocation, favorites);
      dispatch({
        type: 'SET_FROM_LOCATION',
        location: searchedFromLocation,
        icon,
      });
    }
  }, [searchedFromLocation]);
  useEffect(() => {
    if (currentLocation && !fromLocation) {
      dispatch({
        type: 'SET_FROM_LOCATION',
        location: currentLocation,
        icon: <LocationArrow />,
      });
    }
  }, [currentLocation]);

  const searchedToLocation = useLocationSearchValue<AssistantRouteProp>(
    'toLocation',
  );
  useEffect(() => {
    if (searchedToLocation) {
      const icon = getSearchedLocationIcon(searchedToLocation, favorites);
      dispatch({type: 'SET_TO_LOCATION', location: searchedToLocation, icon});
    }
  }, [searchedToLocation]);

  async function search() {
    if (!fromLocation || !toLocation) return;
    dispatch({type: 'SET_IS_SEARCHING'});
    try {
      const response = await searchTrip(fromLocation, toLocation);
      dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns: response.data});
    } catch (err) {
      dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns: null});
    }
  }

  useEffect(() => {
    search();
  }, [fromLocation, toLocation]);

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
