import React from 'react';
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
import {UserLocations, Location, useAppState} from '../../AppContext';
import {useJourneyPlanner} from './useJourneyPlanner';
import {parseISO} from 'date-fns';
import useSortNearest from './useSortNearest';
import Splash from '../Splash';
import {useGeolocationState} from '../../GeolocationContext';
import {formatDistanceStrict} from 'date-fns';
import ResultItem from './ResultItem';

type PlannerProps = {
  userLocations: UserLocations;
  currentLocation: Location;
  resetOnboarding: () => void;
};

const Planner: React.FC<PlannerProps> = ({
  userLocations,
  currentLocation,
  resetOnboarding,
}) => {
  const sortedLocations = useSortNearest(
    currentLocation,
    userLocations.home,
    userLocations.work,
  );

  const [nearest, furthest] = sortedLocations;

  const tripPatterns = useJourneyPlanner(nearest.location, furthest.location);

  const bannerLongPress = () => {
    __DEV__ && resetOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      {userLocations?.home?.id === nearest?.location?.id ? (
        <HomeBanner width="100%" onLongPress={bannerLongPress} />
      ) : (
        <WorkBanner width="100%" onLongPress={bannerLongPress} />
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
              <RefreshControl refreshing={false} onRefresh={() => {}} />
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

const PlannerRoot = () => {
  const {userLocations, resetOnboarding} = useAppState();
  const {location: currentLocation} = useGeolocationState();

  if (!userLocations || !currentLocation || !resetOnboarding) {
    return <Splash />;
  }

  return (
    <Planner
      userLocations={userLocations}
      resetOnboarding={resetOnboarding}
      currentLocation={{
        id: 'current',
        name: 'current',
        label: 'current',
        coordinates: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      }}
    />
  );
};

export default PlannerRoot;
