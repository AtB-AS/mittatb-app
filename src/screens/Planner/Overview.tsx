import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
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

const Overview: React.FC<Props> = ({
  userLocations,
  currentLocation,
  tripPatterns,
  isSearching,
  search,
}) => {
  const sortedLocations = sortNearestLocations(
    currentLocation,
    userLocations.home,
    userLocations.work,
  );

  const [nearest, furthest] = sortedLocations;

  async function searchNearestToFurthest() {
    await search(nearest.location, furthest.location);
  }

  useEffect(() => {
    searchNearestToFurthest();
  }, [nearest.location.id, furthest.location.id]);

  return (
    <SafeAreaView style={styles.container}>
      {userLocations?.home?.id === nearest?.location?.id ? (
        <HomeBanner width="100%" />
      ) : (
        <WorkBanner width="100%" />
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
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.general.white,
                  }}
                >
                  Du må gå innen
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    color: colors.general.white,
                  }}
                >
                  {formatDistanceStrict(
                    Date.now(),
                    parseISO(tripPatterns[0].startTime),
                    {locale: nb, onlyNumeric: true},
                  )}
                </Text>
              </>
            ) : null}
            <Text
              style={{
                fontSize: 12,
                color: colors.general.white,
                marginTop: 8,
              }}
            >
              {nearest?.location.name} til {furthest?.location.name}
            </Text>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isSearching}
                onRefresh={() => searchNearestToFurthest()}
              />
            }
          >
            {tripPatterns.map((pattern, i) => (
              <ResultItem key={i} tripPattern={pattern} />
            ))}
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
});

export default Overview;
