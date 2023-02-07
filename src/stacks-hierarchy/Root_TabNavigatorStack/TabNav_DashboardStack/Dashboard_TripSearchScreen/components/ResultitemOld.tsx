import {ArrowRight, ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {
  AccessibleText,
  screenReaderPause,
  ThemeText,
} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {CollapsedLegs} from './CollapsedLegs';
import {SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  Language,
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {flatMap, interpose} from '@atb/utils/array';
import {
  formatToClock,
  isInThePast,
  secondsBetween,
  secondsToDuration,
  secondsToDurationShort,
} from '@atb/utils/date';
import {getTranslatedModeName} from '@atb/utils/transportation-names';

import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityProps,
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {SearchTime} from '@atb/journey-date-picker';
import {RailReplacementBusMessage} from './RailReplacementBusMessage';
import {
  getNoticesForLeg,
  isSignificantFootLegWalkOrWaitTime,
  significantWaitTime,
  significantWalkTime,
} from '@atb/travel-details-screens/utils';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
  searchTime: SearchTime;
  testID?: string;
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
  strikethrough: boolean;
}> = ({tripPattern, strikethrough}) => {
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
        style={[
          styles.resultHeaderLabel,
          strikethrough && styles.strikethrough,
        ]}
        accessibilityLabel={t(
          TripSearchTexts.results.resultItem.header.time(
            formatToClock(tripPattern.expectedStartTime, language, 'floor'),
            formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
          ),
        )}
        testID="resultStartAndEndTime"
      >
        {formatToClock(startTime, language, 'floor')} –{' '}
        {formatToClock(endTime, language, 'ceil')}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          type="body__secondary"
          color="secondary"
          testID="resultDuration"
          prefix={t(TripSearchTexts.results.resultItem.header.totalDuration)}
        >
          {durationText}
        </AccessibleText>
      </View>

      <RailReplacementBusMessage tripPattern={tripPattern} />

      <SituationOrNoticeIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        notices={flatMap(tripPattern.legs, getNoticesForLeg)}
        accessibilityLabel={t(
          TripSearchTexts.results.resultItem.hasSituationsTip,
        )}
        style={styles.warningIcon}
      />
    </View>
  );
};

const ResultItemOld: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  testID,
  searchTime,
  ...props
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const [collapsableParentWidth, setCollapsableParentWidth] = useState(0);
  const [collapsableWidth, setCollapsableWidth] = useState(0);

  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    tripPattern.legs.length,
  );
  const fadeInValue = useRef(new Animated.Value(0)).current;

  // Dynamically collapse legs to fit horizontally
  useEffect(() => {
    if (collapsableParentWidth && collapsableWidth) {
      if (collapsableWidth >= collapsableParentWidth) {
        setNumberOfExpandedLegs(numberOfExpandedLegs - 1);
      } else {
        fadeIn.start();
      }
    }
  }, [collapsableParentWidth, collapsableWidth]);

  const fadeIn = Animated.timing(fadeInValue, {
    toValue: 1,
    duration: 250,
    useNativeDriver: true,
  });

  if (!tripPattern?.legs?.length) return null;

  const expandedLegs = tripPattern.legs.slice(0, numberOfExpandedLegs);
  const collapsedLegs = tripPattern.legs.slice(
    numberOfExpandedLegs,
    tripPattern.legs.length,
  );
  const legs = expandedLegs.filter((leg, i) =>
    isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
  );

  const isInPast =
    isInThePast(tripPattern.legs[0].expectedStartTime) &&
    searchTime?.option !== 'now';

  return (
    <TouchableOpacity
      accessibilityLabel={tripSummary(tripPattern, t, language, isInPast)}
      accessibilityHint={t(
        TripSearchTexts.results.resultItem.footer.detailsHint,
      )}
      onPress={onDetailsPressed}
      accessible={true}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.result,
          isInPast && styles.resultInPast,
          {opacity: fadeInValue},
        ]}
        {...props}
        accessible={false}
        onLayout={(e) => setCollapsableParentWidth(e.nativeEvent.layout.width)}
      >
        <ResultItemHeader tripPattern={tripPattern} strikethrough={isInPast} />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.detailsContainer}
          {...screenReaderHidden}
          onContentSizeChange={(width) => setCollapsableWidth(width)}
        >
          <View style={styles.legOutput}>
            {interpose(
              legs.map((leg, i) => (
                <View key={leg.aimedStartTime}>
                  {leg.mode === 'foot' ? (
                    <FootLeg leg={leg} nextLeg={tripPattern.legs[i + 1]} />
                  ) : (
                    <TransportationLeg leg={leg} />
                  )}
                </View>
              )),
              <ThemeIcon svg={ChevronRight} size="small" />,
            )}
          </View>
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
      <View style={styles.resultFooterText}>
        <ThemeText
          type="body__secondary"
          style={styles.fromPlaceText}
          numberOfLines={1}
          testID="resultDeparturePlace"
        >
          {t(TripSearchTexts.results.resultItem.footer.fromPlace(quayName)) +
            ' '}
        </ThemeText>
        <ThemeText type="body__secondary" testID="resultDepartureTime">
          {timePrefix + formatToClock(quayStartTime, language, 'floor')}
        </ThemeText>
      </View>
      <View style={styles.detailsTextWrapper}>
        <ThemeText type="body__secondary">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.medium,
  },
  resultInPast: {
    backgroundColor: theme.static.background.background_2.background,
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
  strikethrough: {
    textDecorationLine: 'line-through',
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
  resultFooterText: {
    flexShrink: 1,
    flexDirection: 'row',
  },
  fromPlaceText: {
    flexShrink: 1,
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
  const styles = useLegStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t, language} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const waitDuration = secondsToDuration(waitTimeInSeconds, language);
  const walkDuration = secondsToDuration(leg.duration ?? 0, language);

  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  const a11yText =
    mustWalk && mustWait
      ? t(
          TripSearchTexts.results.resultItem.footLeg.walkandWaitLabel(
            walkDuration,
            waitDuration,
          ),
        )
      : mustWait
      ? t(TripSearchTexts.results.resultItem.footLeg.waitLabel(waitDuration))
      : t(TripSearchTexts.results.resultItem.footLeg.walkLabel(walkDuration));

  return (
    <View
      style={styles.legContainer}
      accessibilityLabel={a11yText}
      testID="fLeg"
    >
      <ThemeIcon svg={Walk} />
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
      <View style={styles.iconContainer} testID="trLeg">
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
          lineNumber={leg.line?.publicCode}
        />
      </View>
    </View>
  );
};

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
) => {
  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const firstLeg = nonFootLegs[0];

  return `
    ${isInPast ? t(TripSearchTexts.results.resultItem.passedTrip) : ''}

    ${
      firstLeg
        ? t(
            TripSearchTexts.results.resultItem.footer.fromPlaceWithTime(
              firstLeg.fromPlace?.name ?? '',
              formatToClock(firstLeg.expectedStartTime, language, 'floor'),
            ),
          )
        : ''
    }

    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line?.publicCode
            ? t(
                TripSearchTexts.results.resultItem.journeySummary.prefixedLineNumber(
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
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .footLegsOnly,
            )
          : nonFootLegs.length === 1
          ? t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .noSwitching,
            )
          : nonFootLegs.length === 2
          ? t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription
                .oneSwitch,
            )
          : t(
              TripSearchTexts.results.resultItem.journeySummary.legsDescription.someSwitches(
                nonFootLegs.length,
              ),
            )
      }

      ${t(
        TripSearchTexts.results.resultItem.journeySummary.totalWalkDistance(
          (tripPattern.walkDistance ?? 0).toFixed(),
        ),
      )}  ${screenReaderPause}
  `;
};

export default ResultItemOld;
