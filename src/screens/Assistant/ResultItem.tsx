import nb from 'date-fns/locale/nb';
import React from 'react';
import {Text, View, TextStyle} from 'react-native';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  formatToClock,
  secondsToDuration,
  secondsToDurationExact,
} from '../../utils/date';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RealTimeLocationIcon from '../../components/location-icon/real-time';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import {DestinationFlag} from '../../assets/svg/icons/places';
import {LegMode} from '@entur/sdk';
import colors from '../../theme/colors';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern): void;
};

function legWithQuay(leg: Leg) {
  // Manually find name of from place based on mode as in some cases
  // (from adresses that are also quays) you won't have quay information in from place.
  const modesWithoutQuay: LegMode[] = ['bicycle', 'foot'];
  return !modesWithoutQuay.includes(leg.mode);
}

const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const firstWithQuay = tripPattern.legs.find(legWithQuay);
  const styles = useThemeStyles();

  return (
    <View style={styles.resultHeader}>
      <Text>
        Fra{' '}
        {firstWithQuay?.fromPlace.name ??
          tripPattern.legs[0]?.fromPlace.name ??
          'Ukjent holdeplass'}
      </Text>
      <Text>{secondsToDurationExact(tripPattern.duration)}</Text>
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
      <View style={styles.result}>
        <ResultItemHeader tripPattern={tripPattern} />

        <View style={styles.detailsContainer}>
          {tripPattern.legs.map(function (leg) {
            if (leg.mode === 'foot') {
              return <FootLeg key={leg.fromPlace.latitude} leg={leg} />;
            }
            return <TransportationLeg key={leg.serviceJourney.id} leg={leg} />;
          })}
          <DestinationLeg tripPattern={tripPattern} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    padding: 12,
    backgroundColor: theme.background.level0,
    borderRadius: 8,
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
  },
  transferText: {fontSize: 16},
  detailsText: {fontSize: 12, textDecorationLine: 'underline'},
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
}));

const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  return (
    <View style={styles.legContainer}>
      <Text style={[styles.textDeprioritized, styles.time]}>
        {formatToClock(leg.expectedStartTime)}
      </Text>
      <View style={styles.iconContainer}>
        <WalkingPerson fill={colors.general.black} opacity={0.6} />
      </View>
      <Text style={styles.textDeprioritized}>
        {secondsToDuration(leg.duration ?? 0, nb)}
      </Text>
    </View>
  );
};

const useLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  time: {
    width: 50,
    fontVariant: ['tabular-nums'],
  },
  text: {
    fontSize: 16,
  },
  textDeprioritized: {
    fontWeight: 'normal',
    fontSize: 14,
    color: theme.text.faded,
  },
  textBold: {
    fontWeight: 'bold',
  },
  walkingPerson: {
    backgroundColor: theme.text.primary,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
}));

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  return (
    <View style={styles.legContainer}>
      <Text style={[styles.text, styles.time, styles.textBold]}>
        {formatToClock(leg.expectedStartTime)}
      </Text>
      <View style={styles.iconContainer}>
        <RealTimeLocationIcon mode={leg.mode} isLive={leg.realtime} />
      </View>
      <Text style={styles.text}>
        <LineDisplayName leg={leg} />
      </Text>
    </View>
  );
};

const DestinationLeg = ({tripPattern}: {tripPattern: TripPattern}) => {
  const styles = useLegStyles();
  const lastLeg = tripPattern.legs[tripPattern.legs.length - 1];
  if (!lastLeg) return null;

  return (
    <View style={styles.legContainer}>
      <Text style={[styles.time, styles.textDeprioritized]}>
        {formatToClock(lastLeg.expectedEndTime)}
      </Text>
      <View style={styles.iconContainer}>
        <DestinationFlag fill={colors.general.black} opacity={0.6} />
      </View>
      <Text style={styles.textDeprioritized} numberOfLines={1}>
        {lastLeg.toPlace.name}
      </Text>
    </View>
  );
};

function LineDisplayName({leg}: {leg: Leg}) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return (
    <Text>
      <Text style={{marginRight: 12, fontWeight: 'bold'}}>
        {leg.line?.publicCode}
      </Text>{' '}
      <Text numberOfLines={1}>{name}</Text>
    </Text>
  );
}

export default ResultItem;
