import React from 'react';
import {Text, View} from 'react-native';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  secondsToDuration,
  secondsToDurationShort,
  secondsBetween,
  secondsToMinutesShort,
  formatToClockOrRelativeMinutes,
} from '../../utils/date';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TransportationIcon from '../../components/transportation-icon';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import {DestinationFlag} from '../../assets/svg/icons/places';
import {LegMode} from '@entur/sdk';
import colors from '../../theme/colors';
import {Duration} from '../../assets/svg/icons/transportation';
import NonVisualSupportLabel from '../../components/non-visual-support';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern): void;
};

function legWithQuay(leg: Leg) {
  if (leg.fromEstimatedCall?.quay) {
    return true;
  }
  // Manually find name of from place based on mode as in some cases
  // (from adresses that are also quays) you won't have quay information in from place.
  const modesWithoutQuay: LegMode[] = ['bicycle', 'foot'];
  return !modesWithoutQuay.includes(leg.mode);
}

function getFromLeg(legs: Leg[]) {
  const found = legs.find(legWithQuay);
  const fromQuay = (found?.fromEstimatedCall ?? found?.fromPlace)?.quay;
  if (!fromQuay) {
    return legs[0].fromPlace.name ?? 'ukjent holdeplass';
  }
  return `${fromQuay.name} ${fromQuay.publicCode ?? ''}`;
}

const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const quayName = getFromLeg(tripPattern.legs);
  const styles = useThemeStyles();
  const durationText = secondsToDurationShort(tripPattern.duration);
  return (
    <View style={styles.resultHeader}>
      <Text>Fra {quayName}</Text>
      <Text>
        <NonVisualSupportLabel text="Reisetid: " />
        {durationText}
      </Text>
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
          {tripPattern.legs.map(function (leg, i) {
            if (leg.mode === 'foot') {
              return (
                <FootLeg
                  key={leg.fromPlace.latitude}
                  leg={leg}
                  nextLeg={tripPattern.legs[i + 1]}
                />
              );
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

const MINIMUM_WAIT_IN_SECONDS = 30;

const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useLegStyles();
  const showWaitTime = Boolean(nextLeg);
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const isWalkTimeOfSignificance = leg.duration > MINIMUM_WAIT_IN_SECONDS;
  const isWaitTimeOfSignificance =
    showWaitTime && waitTimeInSeconds > MINIMUM_WAIT_IN_SECONDS;

  if (!isWalkTimeOfSignificance && !isWaitTimeOfSignificance) {
    return null;
  }

  if (!isWalkTimeOfSignificance && isWaitTimeOfSignificance) {
    return (
      <View style={styles.legContainer}>
        <WaitRow time={waitTimeInSeconds} />
      </View>
    );
  }

  const walkTime = secondsToDuration(leg.duration ?? 0);
  const text = !isWaitTimeOfSignificance
    ? `Gå ${walkTime}`
    : `Gå ${walkTime}. Vent ${secondsToDuration(waitTimeInSeconds)}`;

  return (
    <View style={styles.legContainer}>
      <Text style={[styles.textDeprioritized, styles.time]}>
        {formatToClockOrRelativeMinutes(leg.expectedStartTime)}
      </Text>
      <View style={styles.iconContainer}>
        <WalkingPerson fill={colors.general.black} opacity={0.6} />
      </View>
      <Text style={styles.textDeprioritized}>{text}</Text>
    </View>
  );
};

function WaitRow({time}: {time: number}) {
  const styles = useWaitStyles();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{secondsToMinutesShort(time)}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Duration fill={colors.general.black} opacity={0.6} />
      </View>
    </View>
  );
}

const useWaitStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    width: 50,
  },
  text: {
    fontSize: 12,
    opacity: 0.6,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
}));

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
      <Text style={[styles.text, styles.time]}>
        {formatToClockOrRelativeMinutes(leg.expectedStartTime)}
      </Text>
      <View style={styles.iconContainer}>
        <TransportationIcon mode={leg.mode} publicCode={leg.line?.publicCode} />
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
        {formatToClockOrRelativeMinutes(lastLeg.expectedEndTime)}
      </Text>
      <View accessibilityLabel="Destinasjon" style={styles.iconContainer}>
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
