import React, {useEffect, useReducer, useRef, useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import {
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import nb from 'date-fns/locale/nb';
import HomeBanner from '../../assets/svg/HomeBanner';
import WorkBanner from '../../assets/svg/WorkBanner';
import ProfileIcon from '../../assets/svg/ProfileIcon';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserLocations, Location, useAppState} from '../../AppContext';
import {parseISO} from 'date-fns';
import sortNearestLocations from './sortNearestLocations';
import {formatDistanceStrict} from 'date-fns';
import ResultItem from './ResultItem';
import {TripPattern} from 'src/sdk';
import searchJournies from './searchJournies';
import Splash from '../Splash';
import {useGeolocationState} from '../../GeolocationContext';
import {PlannerStackParams} from './';

const stringifyLocation = (location: Location) =>
  location.id +
  '|' +
  location.coordinates.latitude +
  '|' +
  location.coordinates.longitude;

type Direction = 'home' | 'work';
type Origin = 'current' | 'static';

type OverviewState = {
  from: Location;
  to: Location;
  direction: Direction;
  origin: Origin;
  isSearching: boolean;
  tripPatterns: TripPattern[] | null;
};

type OverviewReducerAction =
  | {type: 'TOGGLE_ORIGIN'}
  | {type: 'SET_DIRECTION'; direction: Direction}
  | {type: 'SET_LOCATIONS'; from: Location; to: Location}
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
    case 'SET_LOCATIONS':
      return {...prevState, from: action.from, to: action.to};
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

type OverviewScreenNavigationProp = StackNavigationProp<
  PlannerStackParams,
  'Overview'
>;

type RootProps = {
  navigation: OverviewScreenNavigationProp;
};

const OverviewRoot: React.FC<RootProps> = ({navigation}) => {
  const {userLocations, restartOnboarding} = useAppState();
  const {location} = useGeolocationState();

  const currentLocation = useMemo<Location | null>(
    () =>
      location
        ? {
            id: 'current',
            name: 'min posisjon',
            label: 'current',
            locality: 'current',
            coordinates: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          }
        : null,
    [location?.coords?.latitude, location?.coords?.longitude],
  );

  if (!userLocations || !currentLocation) {
    return <Splash />;
  }

  return (
    <Overview
      userLocations={userLocations}
      currentLocation={currentLocation}
      restartOnboarding={restartOnboarding}
      navigation={navigation}
    />
  );
};

type Props = {
  userLocations: UserLocations;
  currentLocation: Location;
  restartOnboarding: () => void;
  navigation: OverviewScreenNavigationProp;
};

const Overview: React.FC<Props> = ({
  userLocations,
  currentLocation,
  restartOnboarding,
  navigation,
}) => {
  const sortedWorkHomeLocations = sortNearestLocations(
    currentLocation,
    userLocations.home,
    userLocations.work,
  );

  const [nearest, furthest] = sortedWorkHomeLocations;

  const [
    {from, to, direction, origin, tripPatterns, isSearching},
    dispatch,
  ] = useReducer<OverviewReducer>(overviewReducer, {
    from: nearest.location,
    to: furthest.location,
    direction: userLocations.home.id === furthest.location.id ? 'home' : 'work',
    origin: 'static',
    tripPatterns: null,
    isSearching: false,
  });

  async function searchFromToLocation() {
    dispatch({type: 'SET_IS_SEARCHING'});
    const tripPatterns = await searchJournies(from, to);
    dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns});
  }

  useEffect(() => {
    searchFromToLocation();
  }, [from, to]);

  useEffect(() => {
    const from =
      origin === 'current'
        ? currentLocation
        : direction === 'home'
        ? userLocations.work
        : userLocations.home;
    const to = direction === 'home' ? userLocations.home : userLocations.work;
    dispatch({type: 'SET_LOCATIONS', from, to});
  }, [
    stringifyLocation(nearest.location),
    stringifyLocation(furthest.location),
    stringifyLocation(currentLocation),
    origin,
    direction,
  ]);

  const setDirection = (direction: Direction) =>
    dispatch({type: 'SET_DIRECTION', direction});

  const switchRef = useRef<Switch>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableWithoutFeedback
          style={styles.headerButtonContainer}
          onPress={restartOnboarding}
        >
          <ProfileIcon />
          <Text style={styles.headerButtonText}>Endre {'\n'}adresser</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={styles.headerButtonContainer}
          onPress={() => dispatch({type: 'TOGGLE_ORIGIN'})}
        >
          <Text style={[styles.headerButtonText, {textAlign: 'right'}]}>
            Søk fra min {'\n'}posisjon
          </Text>
          <Switch
            ref={switchRef}
            ios_backgroundColor={colors.general.white}
            trackColor={{
              false: colors.general.white,
              true: colors.primary.green,
            }}
            value={origin === 'current'}
            onValueChange={() => dispatch({type: 'TOGGLE_ORIGIN'})}
          />
        </TouchableWithoutFeedback>
      </View>
      {direction === 'work' ? (
        <TouchableWithoutFeedback onPress={() => setDirection('home')}>
          <WorkBanner width="100%" />
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => setDirection('work')}>
          <HomeBanner width="100%" />
        </TouchableWithoutFeedback>
      )}

      {!tripPatterns ? (
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.spinner}
        />
      ) : (
        <>
          <View style={styles.textContainer}>
            {tripPatterns.length > 0 ? (
              <>
                <Text style={styles.callToActionText}>Du må gå innen</Text>
                <Text style={styles.timeText}>
                  {formatDistanceStrict(
                    Date.now(),
                    parseISO(tripPatterns[0].startTime),
                    {locale: nb, onlyNumeric: true},
                  )}
                </Text>
              </>
            ) : null}
            <Text style={styles.locationText}>
              Fra {from.name} til {to.name}
            </Text>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isSearching}
                onRefresh={() => searchFromToLocation()}
              />
            }
          >
            {tripPatterns.map((pattern, i) => (
              <ResultItem
                key={i}
                tripPattern={pattern}
                onPress={tripPattern =>
                  navigation.push('Detail', {tripPattern})
                }
              />
            ))}
            <View></View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.gray,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9FA0D',
    marginBottom: 8,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 12,
    color: colors.general.white,
    marginHorizontal: 10,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 48,
  },
  spinner: {padding: 72},
  callToActionText: {
    fontSize: 16,
    color: colors.general.white,
  },
  timeText: {
    fontSize: 28,
    color: colors.general.white,
  },
  locationText: {
    fontSize: 12,
    color: colors.general.white,
    marginTop: 8,
  },
});

export default OverviewRoot;
