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
import {useLocationSearchValue} from '../../../location-search';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/core';
import SearchButton from './SearchButton';
import {RootStackParamList} from '../../../navigation';
import {SharedElement} from 'react-navigation-shared-element';
import Header from './Header';
import {useReverseGeocoder} from '../../../location-search/useGeocoder';

type AssistantState = {
  isSearching: boolean;
  tripPatterns: TripPattern[] | null;
};

export type AssistantReducerAction =
  | {type: 'SET_TRIP_PATTERNS'; tripPatterns: TripPattern[] | null}
  | {type: 'SET_IS_SEARCHING'};

type AssistantReducer = (
  prevState: AssistantState,
  action: AssistantReducerAction,
) => AssistantState;

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

function getLegacyUserLocation(
  userLocations: UserFavorites | null,
  type: 'home' | 'work',
) {
  return userLocations?.find(i => i.name === type) ?? null;
}
const Assistant: React.FC<Props> = ({
  currentLocation,
  userLocations,
  navigation,
}) => {
  const [{tripPatterns, isSearching}, dispatch] = useReducer<AssistantReducer>(
    AssistantReducer,
    {
      tripPatterns: null,
      isSearching: false,
    },
  );

  const styles = useThemeStyles();

  const [fromLocation, setFromLocation] = useState<Location | undefined>(
    currentLocation ?? undefined,
  );
  const searchedFromLocation = useLocationSearchValue<AssistantRouteProp>(
    'fromLocation',
  );
  useEffect(() => {
    if (searchedFromLocation) {
      setFromLocation(searchedFromLocation);
    }
  }, [searchedFromLocation]);
  useEffect(() => {
    if (currentLocation && !fromLocation) {
      setFromLocation(currentLocation);
    }
  }, [currentLocation]);

  const [toLocation, setToLocation] = useState<Location | undefined>();
  const searchedToLocation = useLocationSearchValue<AssistantRouteProp>(
    'toLocation',
  );
  useEffect(() => {
    if (searchedToLocation) {
      setToLocation(searchedToLocation);
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
