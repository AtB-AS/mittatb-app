import {ArrowRight, ChevronRight} from '@atb/assets/svg/icons/navigation';
import {DestinationFlag} from '@atb/assets/svg/icons/places';
import {Duration, WalkingPerson} from '@atb/assets/svg/icons/transportation';
import AccessibleText, {
  screenReaderPause,
} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import TransportationIcon from '@atb/components/transportation-icon';
import {Leg, TripPattern} from '@atb/sdk';
import {SituationWarningIcon} from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {
  AssistantTexts,
  dictionary,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {flatMap} from '@atb/utils/array';
import {
  formatToClock,
  secondsBetween,
  secondsToDuration,
  secondsToDurationShort,
  secondsToMinutesShort,
} from '@atb/utils/date';
import insets from '@atb/utils/insets';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {LegMode} from '@entur/sdk';
import React from 'react';
import {
  AccessibilityProps,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

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
  const {t, language} = useTranslation();
  const durationText = secondsToDurationShort(tripPattern.duration, language);
  const startTime = tripPattern.legs[0].expectedStartTime;
  const endTime = tripPattern.legs[tripPattern.legs.length - 1].expectedEndTime;

  return (
    <View style={styles.resultHeader}>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={styles.resultHeaderLabel}
        accessibilityLabel={t(
          AssistantTexts.results.resultItem.header.time(
            formatToClock(tripPattern.startTime, language),
            formatToClock(tripPattern.endTime, language),
          ),
        )}
      >
        {formatToClock(startTime, language)} –{' '}
        {formatToClock(endTime, language)}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          type="body__secondary"
          color="secondary"
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
  const {t, language} = useTranslation();

  if (!tripPattern?.legs?.length) return null;

  return (
    <TouchableOpacity
      accessibilityLabel={tripSummary(tripPattern, t, language)}
      accessibilityHint={t(
        AssistantTexts.results.resultItem.footer.detailsHint,
      )}
      onPress={onDetailsPressed}
      accessible={true}
    >
      <View style={styles.result} {...props} accessible={false}>
        <ResultItemHeader tripPattern={tripPattern} />
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            hitSlop={insets.symmetric(12, 20)}
            contentContainerStyle={styles.detailsContainer}
            {...screenReaderHidden}
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
                >
                  {legOutput}
                  <ThemeIcon svg={ChevronRight} size={'small'} />
                </View>
              );
            })}
            <DestinationLeg tripPattern={tripPattern} />
          </ScrollView>
        </View>
        <ResultItemFooter legs={tripPattern.legs} />
      </View>
    </TouchableOpacity>
  );
};
function ResultItemFooter({legs}: {legs: Leg[]}) {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const quayName = getFromLeg(legs) ?? t(dictionary.travel.quay.defaultName);
  const quayLeg = legs.find(legWithQuay);
  const timePrefix =
    !!quayLeg && !quayLeg.realtime ? t(dictionary.missingRealTimePrefix) : '';
  const quayStartTime = quayLeg?.expectedStartTime ?? legs[0].expectedStartTime;

  return (
    <View style={styles.resultFooter}>
      <ThemeText type={'body__secondary'}>
        {t(
          AssistantTexts.results.resultItem.footer.fromLabel(
            quayName,
            timePrefix + formatToClock(quayStartTime, language),
          ),
        )}
      </ThemeText>

      <View style={styles.detailsTextWrapper}>
        <ThemeText type="body__secondary">
          {t(AssistantTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    backgroundColor: theme.colors.background_0.backgroundColor,
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
    padding: theme.spacings.medium,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsIcon: {
    marginLeft: theme.spacings.xSmall,
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
  const {t, language} = useTranslation();
  const waitTime = `${secondsToMinutesShort(time, language)}`;
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
      <ThemeText type="body__primary--bold">
        <LineDisplayName leg={leg} />
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

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
) => {
  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];

  const firstLeg = nonFootLegs[0];

  return ` 
  
    ${
      firstLeg
        ? t(
            AssistantTexts.results.resultItem.footer.fromLabel(
              firstLeg.fromPlace.name ?? '',
              formatToClock(firstLeg.expectedStartTime, language),
            ),
          )
        : ''
    }
   
    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line
            ? t(
                AssistantTexts.results.resultItem.journeySummary.prefixedLineNumber(
                  l.line.publicCode,
                ),
              )
            : ''
        }
        
        ${l.fromEstimatedCall?.destinationDisplay?.frontText ?? l.line?.name}
        
        `;
      })
      .join(', ')} 
      
      ${
        !nonFootLegs.length
          ? t(
              AssistantTexts.results.resultItem.journeySummary.legsDescription
                .footLegsOnly,
            )
          : nonFootLegs.length === 1
          ? t(
              AssistantTexts.results.resultItem.journeySummary.legsDescription
                .noSwitching,
            )
          : nonFootLegs.length === 2
          ? t(
              AssistantTexts.results.resultItem.journeySummary.legsDescription
                .oneSwitch,
            )
          : t(
              AssistantTexts.results.resultItem.journeySummary.legsDescription.someSwitches(
                nonFootLegs.length,
              ),
            )
      }
      
      ${t(
        AssistantTexts.results.resultItem.journeySummary.totalWalkDistance(
          tripPattern.walkDistance.toFixed(0),
        ),
      )}  ${screenReaderPause}
  `;
};

export default ResultItem;
