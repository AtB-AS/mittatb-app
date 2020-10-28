import React from 'react';
import {View, TouchableOpacity, AccessibilityProps} from 'react-native';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  secondsToDuration,
  secondsToDurationShort,
  secondsBetween,
  secondsToMinutesShort,
  formatToClockOrRelativeMinutes,
  missingRealtimePrefix,
  formatToClock,
} from '../../utils/date';
import TransportationIcon from '../../components/transportation-icon';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import {DestinationFlag} from '../../assets/svg/icons/places';
import {LegMode} from '@entur/sdk';
import colors from '../../theme/colors';
import {Duration} from '../../assets/svg/icons/transportation';
import AccessibleText, {
  screenReaderPause,
} from '../../components/accessible-text';
import {SituationWarningIcon} from '../../situations';
import {flatMap} from '../../utils/array';
import {getReadableModeName} from '../../utils/transportation-names';
import Text from '../../components/text';
import ThemeIcon from '../../components/theme-icon';

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
  const publicCodeOutput = fromQuay.publicCode ? ' ' + fromQuay.publicCode : '';
  return fromQuay.name + publicCodeOutput;
}
const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const quayName = getFromLeg(tripPattern.legs);
  const styles = useThemeStyles();
  const durationText = secondsToDurationShort(tripPattern.duration);

  const quayLeg = tripPattern.legs.find(legWithQuay);
  const timePrefix =
    !!quayLeg && !quayLeg.realtime ? missingRealtimePrefix : '';
  const quayStartTime =
    quayLeg?.expectedStartTime ?? tripPattern.legs[0].expectedStartTime;
  const wordSpacing = ' ';
  return (
    <View style={styles.resultHeader}>
      <Text style={styles.resultHeaderLabel}>
        Fra{wordSpacing}
        {quayName}
        {wordSpacing}
        {timePrefix}
        {formatToClockOrRelativeMinutes(quayStartTime)}
      </Text>
      <View style={styles.durationContainer}>
        <AccessibleText prefix="Reisetid">{durationText}</AccessibleText>
      </View>

      <SituationWarningIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        accessibilityLabel="Denne reisen har driftsmeldinger. Se detaljer for mer info"
        style={styles.warningIcon}
      />
    </View>
  );
};

const ResultItem: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  ...props
}) => {
  const styles = useThemeStyles();

  if (!tripPattern?.legs?.length) return null;

  return (
    <TouchableOpacity
      style={{paddingVertical: 4}}
      onPress={() => onDetailsPressed(tripPattern)}
      hitSlop={insets.symmetric(8, 16)}
      accessibilityValue={{text: screenReaderSummary(tripPattern)}}
      {...props}
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
    borderRadius: theme.border.borderRadius.regular,
  },
  stopName: {
    fontSize: theme.text.sizes.body,
    color: theme.text.colors.primary,
    flexShrink: 1,
  },
  lineContainer: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  time: {
    fontSize: 32,
    color: theme.text.colors.primary,
    marginVertical: 8,
  },
  lineName: {
    fontSize: theme.text.sizes.body,
    fontWeight: '600',
    color: theme.text.colors.primary,
    textAlign: 'center',
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  transferText: {fontSize: theme.text.sizes.body},
  detailsText: {
    fontSize: theme.text.sizes.label,
    textDecorationLine: 'underline',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  resultHeaderLabel: {
    flex: 7,
  },
  durationContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  warningIcon: {
    marginLeft: theme.spacings.small,
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
        <ThemeIcon svg={WalkingPerson} opacity={0.6} />
      </View>
      <Text style={[styles.textContent, styles.textDeprioritized]}>{text}</Text>
    </View>
  );
};

function WaitRow({time}: {time: number}) {
  const styles = useLegStyles();

  return (
    <View style={styles.legContainer}>
      <Text style={[styles.textDeprioritized, styles.time]}>
        {secondsToMinutesShort(time)}
      </Text>
      <View style={styles.iconContainer}>
        <Duration fill={colors.general.black} opacity={0.6} />
      </View>
      <Text style={[styles.textContent, styles.textDeprioritized]}>Vent</Text>
    </View>
  );
}

const useLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  time: {
    minWidth: 50,
    fontVariant: ['tabular-nums'],
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: theme.text.sizes.body,
  },
  textDeprioritized: {
    fontWeight: 'normal',
    fontSize: theme.text.sizes.lead,
    color: theme.text.colors.faded,
  },
  textBold: {
    fontWeight: 'bold',
  },
  walkingPerson: {
    //ackgroundColor: theme.text.colors.primary,
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
      <Text style={[styles.textContent, styles.text]}>
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
        <ThemeIcon svg={DestinationFlag} opacity={0.6} />
      </View>
      <Text
        style={[styles.textContent, styles.textDeprioritized]}
        numberOfLines={1}
      >
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

const screenReaderSummary = (tripPattern: TripPattern) => {
  const hasSituations = flatMap(tripPattern.legs, (leg) => leg.situations)
    .length;

  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const startLeg = !nonFootLegs.length ? tripPattern.legs[0] : nonFootLegs[0];

  return `
  ${
    hasSituations
      ? `Driftsmeldinger gjelder for dette forslaget. ${screenReaderPause} `
      : ''
  }
  Fra klokken: ${formatToClock(
    tripPattern.startTime,
  )}, til klokken ${formatToClock(tripPattern.endTime)}. ${screenReaderPause}
    Reisetid: ${secondsToDuration(tripPattern.duration)} ${screenReaderPause}
    ${
      !nonFootLegs.length
        ? 'Hele reisen til fots'
        : nonFootLegs.length === 1
        ? 'Ingen bytter'
        : nonFootLegs.length === 2
        ? 'Ett bytte'
        : nonFootLegs.length + 'bytter'
    }. ${screenReaderPause}
    ${nonFootLegs
      ?.map((l) => {
        return `${getReadableModeName(l.mode)} ${
          l.line ? 'nummer ' + l.line.publicCode : ''
        }`;
      })
      .join(', ')} ${screenReaderPause}
      Totalt ${tripPattern.walkDistance.toFixed(
        0,
      )} meter å gå. ${screenReaderPause}
      Fra ${startLeg.fromPlace?.name}, klokken ${formatToClock(
    startLeg.expectedStartTime,
  )}. ${screenReaderPause}
      Aktivér for å vise detaljert reiserute.
  `;
};

export default ResultItem;
