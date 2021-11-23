import React from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import ThemeText from '@atb/components/text';
import {
  formatToClock,
  secondsBetween,
  secondsToDuration,
  secondsToDurationShort,
  secondsToMinutesShort,
} from '@atb/utils/date';
import {AssistantTexts, dictionary, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import ThemeIcon from '@atb/components/theme-icon';
import {Duration, WalkingPerson} from '@atb/assets/svg/icons/transportation';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import TransportationIcon from '@atb/components/transportation-icon';
import {ScrollView} from 'react-native-gesture-handler';
import insets from '@atb/utils/insets';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {ArrowRight, ChevronRight} from '@atb/assets/svg/icons/navigation';
import {DestinationFlag} from '@atb/assets/svg/icons/places';

const SIGNIFICANT_WAIT_TIME_IN_SECONDS = 30;

type TripPatternSummaryProps = {
  tripPattern: TripPattern;
};

export const TripPatternSummary: React.FC<TripPatternSummaryProps> = ({
  tripPattern,
  ...props
}) => {
  const {t, language} = useTranslation();
  const styles = useThemeStyles();
  const tripStartTime = formatToClock(tripPattern.expectedStartTime, language);
  const tripEndTime = formatToClock(tripPattern.expectedEndTime, language);

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.timesHeader}>
        <View style={{flexGrow: 1}}>
          <ThemeText>
            {tripStartTime} - {tripEndTime}
          </ThemeText>
        </View>
        <View>
          <ThemeText>
            {secondsToDurationShort(tripPattern.duration, language)}
          </ThemeText>
        </View>
      </View>
      <SummaryLegs tripPattern={tripPattern} />
    </View>
  );
};

type SummaryLegsProps = {
  tripPattern: TripPattern;
};

const SummaryLegs: React.FC<SummaryLegsProps> = ({tripPattern}) => {
  const styles = useThemeStyles();
  return (
    <View style={styles.legsSummary}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        hitSlop={insets.symmetric(12, 20)}
        contentContainerStyle={styles.legsSummaryScrollContainer}
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
            <View style={styles.legOutput} key={leg.aimedStartTime}>
              {legOutput}
              <ThemeIcon svg={ChevronRight} size={'small'} />
            </View>
          );
        })}
        <DestinationLeg tripPattern={tripPattern} />
      </ScrollView>
    </View>
  );
};

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
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

const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useLegStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t, language} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const longWalkTime = leg.duration > SIGNIFICANT_WAIT_TIME_IN_SECONDS;
  const longWaitTime =
    showWaitTime && waitTimeInSeconds > SIGNIFICANT_WAIT_TIME_IN_SECONDS;

  if (!longWalkTime && !longWaitTime) {
    return null;
  }

  if (!longWalkTime && longWaitTime) {
    return (
      <View style={styles.legContainer}>
        <WaitRow time={waitTimeInSeconds} />
      </View>
    );
  }

  const walkTime = secondsToDuration(leg.duration ?? 0, language);
  const text = !longWaitTime
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

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  const legName =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return (
    <View style={styles.legContainer}>
      <View style={[styles.iconContainer, styles.transportationIcon]}>
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
      </View>
      <ThemeText type="body__primary--bold">
        {leg.line?.publicCode} {legName}
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

type LegIconProps = {
  leg: Leg;
};
const LegIcon: React.FC<LegIconProps> = ({leg}) => {
  leg.mode === Mode.Bus;
  return (
    <View>
      <ThemeIcon svg={WalkingPerson} opacity={0.6} />
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  summaryContainer: {
    backgroundColor: theme.colors.background_0.backgroundColor,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.medium,
    padding: theme.spacings.medium,
  },
  timesHeader: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  legOutput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legsSummary: {
    padding: theme.spacings.medium,
  },
  legsSummaryScrollContainer: {
    flexDirection: 'row',
  },
}));
