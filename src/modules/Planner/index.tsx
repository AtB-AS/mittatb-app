import React, {useContext} from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import WalkingPerson from '../../assets/svg/WalkingPerson';
import BusFront from '../../assets/svg/BusFront';
import ArrowRight from '../../assets/svg/ArrowRight';
import HomeBanner from '../../assets/svg/HomeBanner';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppContext from '../../appContext';
import {useJourneyPlanner} from './useJourneyPlanner';
import {TripPattern, Leg} from '../../sdk';
import {format, parseISO} from 'date-fns';
import TramFront from '../../assets/svg/TramFront';
import useSortNearest from './useSortNearest';
import {useGeolocation} from '../../geolocation';

type LegIconProps = {
  leg: Leg;
};

const LegIcon: React.FC<LegIconProps> = ({leg}) => {
  switch (leg.mode) {
    case 'foot':
      return <WalkingPerson />;
    case 'bus':
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BusFront />
          <Text style={{fontSize: 12, color: colors.general.white}}>
            {leg.line?.publicCode}
          </Text>
        </View>
      );
    case 'tram':
      return <TramFront />;
    default:
      return <View />;
  }
};

type ResultItemProps = {
  tripPattern: TripPattern;
};
const ResultItem: React.FC<ResultItemProps> = ({tripPattern}) => {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#F9F9FA0D',
        width: '100%',
        padding: 12,
      }}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 20, color: colors.general.white}}>
          {format(parseISO(tripPattern.startTime), 'HH:mm')} -{' '}
          {format(parseISO(tripPattern.endTime), 'HH:mm')}
        </Text>
        <Text style={{fontSize: 20, color: colors.general.white}}>
          {tripPattern.duration} sekunder
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text style={{fontSize: 12, color: colors.general.white}}>
          Fra {tripPattern.legs[0].toPlace.name} (
          {tripPattern.walkDistance.toFixed(0)} m)
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {tripPattern.legs
            .map((leg, i) => <LegIcon key={i} leg={leg} />)
            .reduce(
              (prev: JSX.Element[], curr: JSX.Element, index, {length}) => {
                return index < length - 1
                  ? prev.concat(curr, <ArrowRight />)
                  : prev.concat(curr);
              },
              [],
            )}
        </View>
      </View>
    </View>
  );
};

const Planner = () => {
  const {userLocations} = useContext(AppContext);
  const currentLocation = useGeolocation();

  const sortedLocations = useSortNearest(
    currentLocation
      ? {
          id: 'current',
          name: 'current',
          label: 'current',
          coordinates: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          },
        }
      : undefined,
    userLocations?.home,
    userLocations?.work,
  );

  const [nearest, furthest] = sortedLocations ?? [];

  const tripPatterns =
    useJourneyPlanner(nearest?.location, furthest?.location) ?? [];

  if (tripPatterns.length === 0)
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );

  return (
    <SafeAreaView style={styles.container}>
      <HomeBanner width="100%" style={styles.banner} />

      <View style={styles.textContainer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.general.white,
          }}
        >
          Du må gå innen
        </Text>
        <Text
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: colors.general.white,
          }}
        >
          2 minutter
        </Text>
        <Text
          style={{fontSize: 16, color: colors.general.white, marginBottom: 48}}
        >
          {nearest?.location.name} til {furthest?.location.name}
        </Text>
        {tripPatterns.map((pattern, i) => (
          <ResultItem key={i} tripPattern={pattern} />
        ))}
      </View>
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
    marginTop: 48,
  },
  banner: {},
  spinner: {padding: 72},
});

export default Planner;
