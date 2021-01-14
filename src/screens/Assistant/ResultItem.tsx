import React from 'react';
import {View, AccessibilityProps, ViewStyle} from 'react-native';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  secondsToDuration,
  secondsToDurationShort,
  secondsBetween,
  secondsToMinutesShort,
  missingRealtimePrefix,
  formatToClock,
} from '../../utils/date';
import TransportationIcon from '../../components/transportation-icon';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import {DestinationFlag} from '../../assets/svg/icons/places';
import {LegMode} from '@entur/sdk';
import {Duration} from '../../assets/svg/icons/transportation';
import AccessibleText, {
  screenReaderPause,
} from '../../components/accessible-text';
import {SituationWarningIcon} from '../../situations';
import {flatMap} from '../../utils/array';
import {getTranslatedModeName} from '../../utils/transportation-names';
import ThemeText from '../../components/text';
import ThemeIcon from '../../components/theme-icon';
import {
  AssistantTexts,
  TranslateFunction,
  dictionary,
  useTranslation,
} from '../../translations/';
import {ScrollView} from 'react-native-gesture-handler';
import {ArrowRight, ChevronRight} from '../../assets/svg/icons/navigation';
import Button from '../../components/button';
import {screenReaderHidden} from '../../utils/accessibility';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
};

function legWithQuay(leg: Leg) {
  if (leg.fromEstimatedCall?.quay) {
    return true;
  }
  // Manually find name of from place based on mode as in some cases
  // (from adresses that are also quays) you won't have quay information in from place.
  const modesWithoutQuay: LegMode[] = [LegMode.BICYCLE, LegMode.FOOT];
  return !modesWithoutQuay.includes(leg.mode);
}

function getFromLeg(legs: Leg[]) {
  const found = legs.find(legWithQuay);
  const fromQuay = (found?.fromEstimatedCall ?? found?.fromPlace)?.quay;
  if (!fromQuay) {
    return legs[0].fromPlace.name;
  }
  const publicCodeOutput = fromQuay.publicCode ? ' ' + fromQuay.publicCode : '';
  return fromQuay.name + publicCodeOutput;
}
const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const durationText = secondsToDurationShort(tripPattern.duration);
  const {t} = useTranslation();
  const startTime = tripPattern.legs[0].expectedStartTime;
  const endTime = tripPattern.legs[tripPattern.legs.length - 1].expectedEndTime;

  return (
    <View style={styles.resultHeader}>
      <ThemeText
        type="lead"
        color="faded"
        style={styles.resultHeaderLabel}
        accessibilityLabel={t(
          AssistantTexts.results.resultItem.header.time(
            formatToClock(tripPattern.startTime),
            formatToClock(tripPattern.endTime),
          ),
        )}
      >
        {formatToClock(startTime)} – {formatToClock(endTime)}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          type="lead"
          color="faded"
          prefix={t(AssistantTexts.results.resultItem.header.totalDuration)}
        >
          {durationText}
        </AccessibleText>
      </View>

      <SituationWarningIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        accessibilityLabel={t(
          AssistantTexts.results.resultItem.hasSituationsTip,
        )}
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
  const {t} = useTranslation();

  if (!tripPattern?.legs?.length) return null;

  return (
    <View style={styles.result} {...props}>
      <ResultItemHeader tripPattern={tripPattern} />
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          hitSlop={insets.symmetric(12, 20)}
          contentContainerStyle={styles.detailsContainer}
          accessibilityValue={{text: tripSummary(tripPattern, t)}}
        >
          {tripPattern.legs.map(function (leg, i) {
            const legOutput =
              leg.mode === 'foot' ? (
                <FootLeg leg={leg} nextLeg={tripPattern.legs[i + 1]} />
              ) : (
                <TransportationLeg leg={leg} />
              );
            return (
              <View
                style={styles.legOutput}
                key={leg.serviceJourney?.id ?? leg.fromPlace.latitude}
                {...screenReaderHidden}
              >
                {legOutput}
                <ThemeIcon svg={ChevronRight} size={'small'} />
              </View>
            );
          })}
          <DestinationLeg tripPattern={tripPattern} />
        </ScrollView>
      </View>
      <ResultItemFooter
        legs={tripPattern.legs}
        onDetailsPressed={onDetailsPressed}
      />
    </View>
  );
};
const ResultItemFooter: React.FC<{legs: Leg[]; onDetailsPressed(): void}> = ({
  legs,
  onDetailsPressed,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const quayName = getFromLeg(legs) ?? t(dictionary.travel.quay.defaultName);
  const quayLeg = legs.find(legWithQuay);
  const timePrefix =
    !!quayLeg && !quayLeg.realtime ? missingRealtimePrefix : '';
  const quayStartTime = quayLeg?.expectedStartTime ?? legs[0].expectedStartTime;

  return (
    <View style={styles.resultFooter}>
      <ThemeText type={'lead'}>
        {t(
          AssistantTexts.results.resultItem.footer.fromLabel(
            quayName,
            timePrefix + formatToClock(quayStartTime),
          ),
        )}
      </ThemeText>
      <Button
        text={t(AssistantTexts.results.resultItem.footer.detailsLabel)}
        accessibilityHint={t(
          AssistantTexts.results.resultItem.footer.detailsHint,
        )}
        icon={ArrowRight}
        iconPosition="right"
        mode="tertiary"
        type="compact"
        onPress={onDetailsPressed}
        textStyle={styles.detailsButtonText}
      />
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.medium,
  },
  scrollContainer: {
    padding: theme.spacings.medium,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacings.medium,
    paddingBottom: 0,
  },
  resultHeaderLabel: {
    flex: 3,
  },
  legOutput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultFooter: {
    flexDirection: 'row',
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
    paddingLeft: theme.spacings.medium,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailsButtonText: theme.text.lead,

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
  const {t, language} = useTranslation();
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

  const walkTime = secondsToDuration(leg.duration ?? 0, language);
  const text = !isWaitTimeOfSignificance
    ? t(AssistantTexts.results.resultItem.footLeg.walkLabel(walkTime))
    : t(
        AssistantTexts.results.resultItem.footLeg.walkandWaitLabel(
          walkTime,
          secondsToDuration(waitTimeInSeconds, language),
        ),
      );

  return (
    <View style={styles.legContainer} accessibilityLabel={text}>
      <ThemeIcon svg={WalkingPerson} opacity={0.6} />
    </View>
  );
};

function WaitRow({time}: {time: number}) {
  const styles = useLegStyles();
  const {t} = useTranslation();
  const waitTime = `${secondsToMinutesShort(time)}`;
  return (
    <View
      accessibilityLabel={t(AssistantTexts.results.resultItem.waitRow.label)}
    >
      <ThemeIcon svg={Duration} opacity={0.6} />
    </View>
  );
}

const useLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  lineDisplayName: {
    fontWeight: '700',
  },
  transportationIcon: {
    marginRight: theme.spacings.xSmall,
  },
}));

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  return (
    <View style={styles.legContainer}>
      <View style={[styles.iconContainer, styles.transportationIcon]}>
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
      </View>
      <ThemeText type="body">
        <LineDisplayName style={styles.lineDisplayName} leg={leg} />
      </ThemeText>
    </View>
  );
};

const DestinationLeg = ({tripPattern}: {tripPattern: TripPattern}) => {
  const styles = useLegStyles();
  const lastLeg = tripPattern.legs[tripPattern.legs.length - 1];
  if (!lastLeg) return null;

  return (
    <View style={styles.legContainer}>
      <View style={styles.iconContainer}>
        <ThemeIcon svg={DestinationFlag} opacity={0.6} />
      </View>
    </View>
  );
};

function LineDisplayName({leg, style}: {leg: Leg; style?: ViewStyle}) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return (
    <ThemeText style={style}>
      {leg.line?.publicCode} {name}
    </ThemeText>
  );
}

const tripSummary = (tripPattern: TripPattern, t: TranslateFunction) => {
  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const screenreaderText = AssistantTexts.results.resultItem.journeySummary;

  return `
    ${
      !nonFootLegs.length
        ? t(screenreaderText.legsDescription.footLegsOnly)
        : nonFootLegs.length === 1
        ? t(screenreaderText.legsDescription.noSwitching)
        : nonFootLegs.length === 2
        ? t(screenreaderText.legsDescription.oneSwitch)
        : t(screenreaderText.legsDescription.someSwitches(nonFootLegs.length))
    }. ${screenReaderPause}
    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line
            ? t(screenreaderText.prefixedLineNumber(l.line.publicCode))
            : ''
        }`;
      })
      .join(', ')} ${screenReaderPause}
      ${t(
        screenreaderText.totalWalkDistance(tripPattern.walkDistance.toFixed(0)),
      )}  ${screenReaderPause}
     

  `;
};

export default ResultItem;
