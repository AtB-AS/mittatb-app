import React, {useEffect, useState, useReducer, useRef} from 'react';
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

type Props = {
  userLocations: UserLocations;
  currentLocation: Location;
  tripPatterns: TripPattern[] | null;
  isSearching: boolean;
  search: (from: Location, to: Location) => void;
};

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
};

type OverviewReducerAction =
  | {type: 'TOGGLE_ORIGIN'}
  | {type: 'SET_DIRECTION'; direction: Direction}
  | {type: 'SET_LOCATIONS'; from: Location; to: Location};

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
  }
};

const Overview: React.FC<Props> = ({
  userLocations,
  currentLocation,
  tripPatterns,
  isSearching,
  search,
}) => {
  const {resetOnboarding} = useAppState();
  const sortedWorkHomeLocations = sortNearestLocations(
    currentLocation,
    userLocations.home,
    userLocations.work,
  );

  const [nearest, furthest] = sortedWorkHomeLocations;

  const [{from, to, direction, origin}, dispatch] = useReducer<OverviewReducer>(
    overviewReducer,
    {
      from: nearest.location,
      to: furthest.location,
      direction:
        userLocations.home.id === furthest.location.id ? 'home' : 'work',
      origin: 'static',
    },
  );

  async function searchFromToLocation() {
    await search(from, to);
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
          onPress={resetOnboarding}
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
              <ResultItem key={i} tripPattern={pattern} />
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

export default Overview;
