import {ArrowRight, ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {DestinationFlag} from '@atb/assets/svg/mono-icons/places';
import {
  Duration,
  WalkingPerson,
} from '@atb/assets/svg/mono-icons/transportation';
import AccessibleText, {
  screenReaderPause,
} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import TransportationIcon, {
  CollapsedLegs,
} from '@atb/components/transportation-icon';

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
} from '@atb/utils/date';
import {getTranslatedModeName} from '@atb/utils/transportation-names';

import React, {useRef, useState} from 'react';
import {
  AccessibilityProps,
  View,
  TouchableOpacity,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
};

function legWithQuay(leg: Leg) {
  if (leg.fromEstimatedCall?.quay) {
    return true;
  }
  if (!leg.mode) return false;

  // Manually find name of from place based on mode as in some cases
  // (from adresses that are also quays) you won't have quay information in from place.
  const modesWithoutQuay: Mode[] = [Mode.Bicycle, Mode.Foot];
  return !modesWithoutQuay.includes(leg.mode);
}

function getFirstQuayName(legs: Leg[]) {
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
            formatToClock(tripPattern.expectedStartTime, language),
            formatToClock(tripPattern.expectedEndTime, language),
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
  const [parentWidth, setParentWidth] = useState(0);
  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    tripPattern?.legs?.length,
  );
  const animValue = useRef(new Animated.Value(0)).current;

  if (!tripPattern?.legs?.length) return null;

  const fadeIn = Animated.timing(animValue, {
    toValue: 1,
    duration: 250,
    useNativeDriver: true,
  });

  const expandedLegs = tripPattern.legs.slice(0, numberOfExpandedLegs);
  const collapsedLegs = tripPattern.legs.slice(
    numberOfExpandedLegs,
    tripPattern.legs.length,
  );

  const setCollapseParentWidth = (e: LayoutChangeEvent) => {
    setParentWidth(e.nativeEvent.layout.width);
  };

  const collapsableContentChanged = (width: number) => {
    if (width >= parentWidth) {
      setNumberOfExpandedLegs(numberOfExpandedLegs - 1);
    } else {
      fadeIn.start();
    }
  };

  return (
    <TouchableOpacity
      accessibilityLabel={tripSummary(tripPattern, t, language)}
      accessibilityHint={t(
        AssistantTexts.results.resultItem.footer.detailsHint,
      )}
      onPress={onDetailsPressed}
      accessible={true}
    >
      <Animated.View
        style={[styles.result, {opacity: animValue}]}
        {...props}
        accessible={false}
        onLayout={(e) => setCollapseParentWidth(e)}
      >
        <ResultItemHeader tripPattern={tripPattern} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.detailsContainer}
          {...screenReaderHidden}
          onContentSizeChange={(width) => collapsableContentChanged(width)}
        >
          {expandedLegs.map(function (leg, i) {
            return (
              <View style={styles.legOutput} key={leg.aimedStartTime}>
                {leg.mode === 'foot' ? (
                  <FootLeg leg={leg} nextLeg={tripPattern.legs[i + 1]} />
                ) : (
                  <>
                    <TransportationLeg leg={leg} />
                    <ThemeIcon svg={ChevronRight} size={'small'} />
                  </>
                )}
              </View>
            );
          })}
          <View style={styles.legOutput}>
            <CollapsedLegs legs={collapsedLegs} />
          </View>
        </ScrollView>
        <ResultItemFooter legs={tripPattern.legs} />
      </Animated.View>
    </TouchableOpacity>
  );
};
function ResultItemFooter({legs}: {legs: Leg[]}) {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const quayName =
    getFirstQuayName(legs) ?? t(dictionary.travel.quay.defaultName);
  const quayLeg = legs.find(legWithQuay);
  const timePrefix =
    !!quayLeg && !quayLeg.realtime ? t(dictionary.missingRealTimePrefix) : '';
  const quayStartTime = quayLeg?.expectedStartTime ?? legs[0].expectedStartTime;

  return (
    <View style={styles.resultFooter}>
      <ThemeText
        type={'body__secondary'}
        style={{flexShrink: 1}}
        numberOfLines={1}
      >
        {t(AssistantTexts.results.resultItem.footer.fromPlace(quayName))}
      </ThemeText>

      <ThemeText>
        {timePrefix + formatToClock(quayStartTime, language)}
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

  detailsContainer: {
    padding: theme.spacings.medium,
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
    paddingLeft: theme.spacings.medium,
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

const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const MINIMUM_WAIT_IN_SECONDS = 30;
  const styles = useLegStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t, language} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const waitDuration = secondsToDuration(waitTimeInSeconds, language);
  const walkDuration = secondsToDuration(leg.duration ?? 0, language);

  const mustWalk = leg.duration > MINIMUM_WAIT_IN_SECONDS;
  const mustWait = showWaitTime && waitTimeInSeconds > MINIMUM_WAIT_IN_SECONDS;

  if (!mustWait && !mustWalk) {
    return null;
  }

  const a11yText =
    mustWalk && mustWait
      ? t(
          AssistantTexts.results.resultItem.footLeg.walkandWaitLabel(
            walkDuration,
            waitDuration,
          ),
        )
      : mustWait
      ? t(AssistantTexts.results.resultItem.footLeg.waitLabel(waitDuration))
      : t(AssistantTexts.results.resultItem.footLeg.walkLabel(walkDuration));

  return (
    <View style={styles.legContainer} accessibilityLabel={a11yText}>
      {!mustWalk ? (
        <ThemeIcon svg={Duration} />
      ) : (
        <ThemeIcon svg={WalkingPerson} />
      )}
      <ThemeIcon svg={ChevronRight} size={'small'} />
    </View>
  );
};

const useLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    marginHorizontal: theme.spacings.xSmall,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  return (
    <View style={styles.legContainer}>
      <View style={styles.iconContainer}>
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
          lineNumber={leg.line?.publicCode}
        />
      </View>
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
        <ThemeIcon svg={DestinationFlag} />
      </View>
    </View>
  );
};

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
            AssistantTexts.results.resultItem.footer.fromPlaceWithTime(
              firstLeg.fromPlace?.name ?? '',
              formatToClock(firstLeg.expectedStartTime, language),
            ),
          )
        : ''
    }
   
    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line?.publicCode
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
          (tripPattern.walkDistance ?? 0).toFixed(),
        ),
      )}  ${screenReaderPause}
  `;
};

export default ResultItem;
