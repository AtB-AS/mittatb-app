import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import {ScrollView, Switch} from 'react-native-gesture-handler';
import nb from 'date-fns/locale/nb';
import HomeBanner from '../../assets/svg/HomeBanner';
import WorkBanner from '../../assets/svg/WorkBanner';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserLocations, Location} from '../../AppContext';
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

const Overview: React.FC<Props> = ({
  userLocations,
  currentLocation,
  tripPatterns,
  isSearching,
  search,
}) => {
  const [searchFromLocation, setSearchFromLocation] = useState(false);

  const sortedWorkHomeLocations = sortNearestLocations(
    currentLocation,
    userLocations.home,
    userLocations.work,
  );

  const [nearest, furthest] = sortedWorkHomeLocations;

  const [fromLocation, setFromLocation] = useState<Location>(nearest.location);
  const [toLocation, setToLocation] = useState<Location>(furthest.location);

  const direction = userLocations.home.id === toLocation.id ? 'home' : 'work';

  async function searchFromToLocation() {
    await search(fromLocation, toLocation);
  }

  useEffect(() => {
    searchFromToLocation();
  }, [fromLocation, toLocation]);

  useEffect(() => {
    if (!searchFromLocation) {
      setFromLocation(nearest.location);
      setToLocation(furthest.location);
    } else {
      setFromLocation(currentLocation);
      setToLocation(furthest.location);
    }
  }, [
    stringifyLocation(nearest.location),
    stringifyLocation(furthest.location),
    stringifyLocation(currentLocation),
    searchFromLocation,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {direction === 'work' ? (
        <WorkBanner width="100%" />
      ) : (
        <HomeBanner width="100%" />
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
              {fromLocation.name} til {toLocation.name}
            </Text>
            <View style={styles.locationSwitchContainer}>
              <Text style={styles.searchFromLocationText}>
                Søk fra din posisjon:
              </Text>
              <Switch
                value={searchFromLocation}
                onValueChange={setSearchFromLocation}
              />
            </View>
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
  locationSwitchContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchFromLocationText: {
    fontSize: 12,
    color: colors.general.white,
    marginRight: 5,
  },
});

export default Overview;
