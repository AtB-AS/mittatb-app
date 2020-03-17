import React, {useEffect, useReducer, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './Header';
import Results from './Results';
import {useAppState} from '../../../AppContext';
import {TripPattern} from '../../../sdk';
import {PlannerStackParams} from '../';
import {useGeolocationState} from '../../../GeolocationContext';
import Splash from '../../Splash';
import WorkBanner from '../../../assets/svg/WorkBanner';
import HomeBanner from '../../../assets/svg/HomeBanner';
import colors from '../../../theme/colors';
import useCalculateTrip from './useCalculateTrip';
import useSortedLocations from './useSortedLocations';
import {searchTrip} from '../../../api';
import {UserFavorites, Location} from '../../../favorites/types';
import {RootStackParamList} from '../../../navigation';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  useLocationSearchValue,
  openLocationSearchModal,
} from '../../../location-search';

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

type OverviewRouteName = 'Overview';
const OverviewRouteNameStatic: OverviewRouteName = 'Overview';

export type OverviewScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PlannerStackParams, OverviewRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type OverviewRouteProp = RouteProp<PlannerStackParams, OverviewRouteName>;

type RootProps = {
  navigation: OverviewScreenNavigationProp;
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
  const {furthest} = useSortedLocations(currentLocation, userLocations);
  const [{direction, origin, tripPatterns, isSearching}, dispatch] = useReducer<
    OverviewReducer
  >(overviewReducer, {
    direction: furthest
      ? getLegacyUserLocation(userLocations, 'home')?.location.id ===
        furthest?.id
        ? 'home'
        : 'work'
      : 'work',
    origin: 'static',
    tripPatterns: null,
    isSearching: false,
  });

  const {from, to} = useCalculateTrip(
    currentLocation,
    userLocations,
    origin,
    direction,
  );

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

  const searchedLocation = useLocationSearchValue<OverviewRouteProp>();
  useEffect(() => console.log('[MODAL CALLBACKS]: ', searchedLocation), [
    searchedLocation,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        dispatch={dispatch}
        origin={origin}
        geolocationDisabled={!currentLocation}
      />
      {direction === 'work' ? (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('LocationSearch', {callerRouteName: 'Overview'})
          }
        >
          <WorkBanner width="100%" />
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('LocationSearch')}
        >
          <HomeBanner width="100%" />
        </TouchableWithoutFeedback>
      )}

      <Results
        tripPatterns={tripPatterns}
        from={from}
        to={to}
        isSearching={isSearching}
        search={search}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.gray,
    flex: 1,
  },
});

export default OverviewRoot;
