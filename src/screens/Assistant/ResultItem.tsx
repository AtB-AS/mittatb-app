import nb from 'date-fns/locale/nb';
import React from 'react';
import {Text, View, ViewStyle} from 'react-native';
import WalkingPerson from '../../assets/svg/WalkingPerson';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import colors from '../../theme/colors';
import {formatToClock, secondsToDuration} from '../../utils/date';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RealTimeLocationIcon from '../../components/location-icon/real-time';
import insets from '../../utils/insets';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern): void;
};

const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const firstWithQuay = tripPattern.legs.find((leg) => leg.fromPlace.quay);

  return (
    <View>
      <Text>Fra {firstWithQuay?.fromPlace.quay?.name}</Text>
      <Text>{secondsToDuration(tripPattern.duration, nb)}</Text>
    </View>
  );
};

const ResultItem: React.FC<ResultItemProps> = ({
  tripPattern,
  onDetailsPressed,
}) => {
  const styles = useThemeStyles();

  if (!tripPattern?.legs?.length) return null;

  return (
    <TouchableOpacity
      style={{paddingVertical: 4}}
      onPress={() => onDetailsPressed(tripPattern)}
      hitSlop={insets.symmetric(8, 16)}
    >
      <View style={styles.legContainer}>
        <ResultItemHeader tripPattern={tripPattern} />

        <View style={styles.detailsContainer}>
          {tripPattern.legs.map(function (leg) {
            if (leg.mode === 'foot') {
              return <FootLeg key={leg.fromPlace.latitude} leg={leg} />;
            }
            return <TransportationLeg key={leg.fromPlace.latitude} leg={leg} />;
          })}
          <DestinationLeg tripPattern={tripPattern} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    flexDirection: 'column',
    paddingHorizontal: 50,
    width: '100%',
  },
  stopName: {
    fontSize: 16,
    color: theme.text.primary,
    flexShrink: 1,
  },
  lineContainer: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  time: {fontSize: 32, color: theme.text.primary, marginVertical: 8},
  lineName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    textAlign: 'center',
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'column',
    paddingTop: 12,
    height: 88,
  },
  transferText: {fontSize: 16},
  detailsText: {fontSize: 12, textDecorationLine: 'underline'},
}));

const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useFootLegStyles();
  return (
    <View style={styles.legContainer}>
      <Text style={{fontSize: 16}}>{formatToClock(leg.expectedStartTime)}</Text>
      <WalkingPerson fill={styles.walkingPerson.backgroundColor} />
      <Text style={{fontSize: 16}}>
        {secondsToDuration(leg.duration ?? 0, nb)}
      </Text>
    </View>
  );
};

const useFootLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {flexDirection: 'row', paddingVertical: 4},
  walkingPerson: {
    backgroundColor: theme.text.primary,
  },
}));

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useFootLegStyles();
  return (
    <View style={styles.legContainer}>
      <Text>{formatToClock(leg.expectedStartTime)}</Text>
      <RealTimeLocationIcon mode={leg.mode} isLive={leg.realtime} />
      <Text>{getLineDisplayName(leg)}</Text>
    </View>
  );
};

const DestinationLeg = ({tripPattern}: {tripPattern: TripPattern}) => {
  const styles = useFootLegStyles();
  const lastLeg = tripPattern.legs[tripPattern.legs.length - 1];
  if (!lastLeg) return null;

  return (
    <View style={styles.legContainer}>
      <Text>{formatToClock(lastLeg.expectedEndTime)}</Text>
      <Text>{lastLeg.toPlace.name}</Text>
    </View>
  );
};

function getLineDisplayName(leg: Leg) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return leg.line?.publicCode + ' ' + name;
}

export default ResultItem;
