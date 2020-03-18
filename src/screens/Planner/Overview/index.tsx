import React, {useEffect, useReducer, useMemo, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
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

export type Direction = 'home' | 'work';
export type Origin = 'current' | 'static';

type OverviewState = {
  direction: Direction;
  origin: Origin;
  isSearching: boolean;
  tripPatterns: TripPattern[] | null;
};

export type OverviewReducerAction =
  | {type: 'TOGGLE_ORIGIN'}
  | {type: 'SET_DIRECTION'; direction: Direction}
  | {type: 'SET_TRIP_PATTERNS'; tripPatterns: TripPattern[] | null}
  | {type: 'SET_IS_SEARCHING'};

type OverviewReducer = (
  prevState: OverviewState,
  action: OverviewReducerAction,
) => OverviewState;

const overviewReducer: OverviewReducer = (prevState, action) => {
  switch (action.type) {
    case 'TOGGLE_ORIGIN':
      return {
        ...prevState,
        origin: prevState.origin === 'static' ? 'current' : 'static',
      };
    case 'SET_DIRECTION':
      return {...prevState, direction: action.direction};
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

export type OverviewScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PlannerStackParams, 'Overview'>,
  StackNavigationProp<RootStackParamList>
>;

type OverviewRouteProp = RouteProp<PlannerStackParams, 'Overview'>;

type RootProps = {
  navigation: OverviewScreenNavigationProp;
  route: OverviewRouteProp;
};

const OverviewRoot: React.FC<RootProps> = ({navigation}) => {
  const {userLocations} = useAppState();
  const {status, location} = useGeolocationState();

  const currentLocation = useMemo<Location | null>(
    () =>
      location
        ? ({
            id: 'current',
            name: 'Min posisjon',
            label: 'current',
            locality: 'current',
            coordinates: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          } as Location)
        : null,
    [location?.coords?.latitude, location?.coords?.longitude],
  );

  if (!userLocations || !status) {
    return <Splash />;
  }

  return (
    <Overview
      userLocations={userLocations}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
};

type Props = {
  currentLocation: Location | null;
  userLocations: UserFavorites;
  navigation: OverviewScreenNavigationProp;
};

function getLegacyUserLocation(
  userLocations: UserFavorites | null,
  type: 'home' | 'work',
) {
  return userLocations?.find(i => i.name === type) ?? null;
}
const Overview: React.FC<Props> = ({
  currentLocation,
  userLocations,
  navigation,
}) => {
  // @ts-ignore
  const from = getLegacyUserLocation(userLocations, 'home').location;
  // @ts-ignore
  const to = getLegacyUserLocation(userLocations, 'work').location;

  const [{direction, origin, tripPatterns, isSearching}, dispatch] = useReducer<
    OverviewReducer
  >(overviewReducer, {
    direction: 'work',
    origin: 'static',
    tripPatterns: null,
    isSearching: false,
  });

  async function search() {
    dispatch({type: 'SET_IS_SEARCHING'});
    try {
      const response = await searchTrip(from, to);
      dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns: response.data});
    } catch (err) {
      dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns: null});
    }
  }

  useEffect(() => {
    search();
  }, [from, to]);

  const styles = useThemeStyles();

  const [fromLocation, setFromLocation] = useState<Location | undefined>(from);
  const searchedFromLocation = useLocationSearchValue<OverviewRouteProp>(
    'fromLocation',
  );
  useEffect(() => {
    if (searchedFromLocation) {
      setFromLocation(searchedFromLocation);
    }
  }, [searchedFromLocation]);

  const [toLocation, setToLocation] = useState<Location | undefined>(to);
  const searchedToLocation = useLocationSearchValue<OverviewRouteProp>(
    'toLocation',
  );
  useEffect(() => {
    if (searchedToLocation) {
      setToLocation(searchedToLocation);
    }
  }, [searchedToLocation]);

  const openLocationSearch = (
    callerRouteParam: keyof OverviewRouteProp['params'],
  ) =>
    navigation.navigate('LocationSearch', {
      callerRouteName: 'Overview',
      callerRouteParam,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header>Reiseassistent</Header>
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Fra"
          location={fromLocation}
          onPress={() => openLocationSearch('fromLocation')}
        />
      </SharedElement>
      <Results
        tripPatterns={tripPatterns}
        from={from}
        to={to}
        isSearching={isSearching}
        search={search}
        navigation={navigation}
      />
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Til"
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

export default OverviewRoot;
