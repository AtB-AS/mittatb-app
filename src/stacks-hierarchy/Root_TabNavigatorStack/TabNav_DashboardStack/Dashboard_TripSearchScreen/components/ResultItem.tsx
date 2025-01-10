import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {
  AccessibleText,
  screenReaderPause,
  ThemeText,
} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CounterIconBox, TransportationIconBox} from '@atb/components/icon-box';
import {SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  dictionary,
  Language,
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {flatMap} from '@atb/utils/array';
import {
  formatToClock,
  isInThePast,
  secondsBetween,
  secondsToDuration,
  secondsToDurationShort,
  secondsToMinutes,
} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';

import React, {useEffect, useRef, useState} from 'react';
import {
  AccessibilityProps,
  Animated,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {SearchTime} from '@atb/journey-date-picker';
import {RailReplacementBusMessage} from './RailReplacementBusMessage';
import {
  getFilteredLegsByWalkOrWaitTime,
  getNoticesForLeg,
  getTimeRepresentationType,
  getTripPatternBookingStatus,
  isLineFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
} from '@atb/travel-details-screens/utils';
import {Destination} from '@atb/assets/svg/mono-icons/places';
import {useFontScale} from '@atb/utils/use-font-scale';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useNow} from '@atb/utils/use-now';
import {TripPatternBookingStatus} from '@atb/travel-details-screens/types';
import {MessageInfoText} from '@atb/components/message-info-text';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  resultIndex: number;
  searchTime: SearchTime;
  testID?: string;
};

const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  let start = tripPattern.legs[0];
  let startName = start.fromPlace.name;
  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    start = tripPattern.legs[1];
    startName = getQuayName(start.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    startName = getQuayName(start.fromPlace.quay);
  }
  const startLegIsFlexibleTransport = isLineFlexibleTransport(start.line);
  const publicCode = start.fromPlace.quay?.publicCode || start.line?.publicCode;

  const durationText = secondsToDurationShort(tripPattern.duration, language);
  const transportName = t(getTranslatedModeName(start.mode));

  return (
    <View style={styles.resultHeader}>
      <ThemeText
        style={styles.fromPlaceText}
        typography="body__secondary--bold"
        testID="resultDeparturePlace"
      >
        {startName
          ? t(
              TripSearchTexts.results.resultItem.header.title(
                transportName,
                startName,
              ),
            )
          : startLegIsFlexibleTransport && publicCode
          ? t(
              TripSearchTexts.results.resultItem.header.flexTransportTitle(
                publicCode,
              ),
            )
          : transportName}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          typography="body__secondary"
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

const ResultItem: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  testID,
  searchTime,
  ...props
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const [legIconsParentWidth, setLegIconsParentWidth] = useState(0);
  const [legIconsContentWidth, setLegIconsContentWidth] = useState(0);

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const resultNumber = resultIndex + 1;

  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    filteredLegs.length,
  );
  const fadeInValueRef = useRef(new Animated.Value(0));

  const [hasMinimumOfExpandedLegs, setHasMinimumOfExpandedLegs] =
    useState(false);

  // Dynamically collapse legs to fit horizontally
  useEffect(() => {
    if (legIconsParentWidth && legIconsContentWidth) {
      if (
        legIconsContentWidth >= legIconsParentWidth &&
        !hasMinimumOfExpandedLegs
      ) {
        setNumberOfExpandedLegs((val) => Math.max(val - 1, 1));
      } else {
        Animated.timing(fadeInValueRef.current, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [legIconsParentWidth, legIconsContentWidth, hasMinimumOfExpandedLegs]);

  useEffect(() => {
    if (numberOfExpandedLegs <= 1) {
      setHasMinimumOfExpandedLegs(true);
    }
  }, [numberOfExpandedLegs, setHasMinimumOfExpandedLegs]);

  if (filteredLegs.length < 1) return null;

  const lastLegIsFlexible = isLineFlexibleTransport(
    filteredLegs[filteredLegs.length - 1].line,
  );
  const expandedLegs = filteredLegs.slice(0, numberOfExpandedLegs);
  const collapsedLegs = filteredLegs.slice(
    numberOfExpandedLegs,
    filteredLegs.length,
  );

  const isInPast =
    isInThePast(tripPattern.legs[0].expectedStartTime) &&
    searchTime?.option !== 'now';
  const iconHeight = {
    height: theme.icon.size['normal'] * fontScale + theme.spacing.small * 2,
  };
  const lineHeight = {height: (theme.spacing.xSmall / 2) * fontScale};

  const staySeated = (idx: number): boolean => {
    const previousLeg = expandedLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  const displayLegDash = (idx: number): boolean =>
    idx < expandedLegs.length - 1 && !staySeated(idx + 1);

  return (
    <PressableOpacity
      accessibilityLabel={tripSummary(
        tripPattern,
        t,
        language,
        isInPast,
        resultNumber,
      )}
      accessibilityHint={t(
        TripSearchTexts.results.resultItem.footer.detailsHint,
      )}
      accessibilityRole="button"
      style={styles.pressableOpacity}
      onPress={() => onDetailsPressed(tripPattern, resultIndex)}
      accessible={true}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.result,
          isInPast && styles.resultInPast,
          {opacity: fadeInValueRef.current},
        ]}
        {...props}
        accessible={false}
      >
        <ResultItemHeader tripPattern={tripPattern} />
        <View style={styles.detailsContainer} {...screenReaderHidden}>
          <View
            style={styles.flexRow}
            onLayout={(ev) => {
              setLegIconsParentWidth(ev.nativeEvent.layout.width);
            }}
          >
            <View
              style={styles.row}
              onLayout={(ev) => {
                setLegIconsContentWidth(ev.nativeEvent.layout.width);
              }}
            >
              <View style={styles.legOutput}>
                {expandedLegs.map((leg, i) => (
                  <View
                    key={tripPattern.compressedQuery + leg.aimedStartTime}
                    style={styles.legAndDash}
                  >
                    <View testID="tripLeg">
                      {leg.mode === 'foot' ? (
                        <FootLeg leg={leg} nextLeg={filteredLegs[i + 1]} />
                      ) : staySeated(i) ? null : (
                        <TransportationLeg
                          leg={leg}
                          style={
                            isSignificantDifference(leg)
                              ? styles.transportationIcon_wide
                              : undefined
                          }
                        />
                      )}
                      <View style={styles.departureTimes}>
                        {staySeated(i) ? null : (
                          <ThemeText
                            typography="body__tertiary"
                            color="primary"
                            testID={'schTime' + i}
                          >
                            {(isLineFlexibleTransport(leg.line)
                              ? t(dictionary.missingRealTimePrefix)
                              : '') +
                              formatToClock(
                                leg.expectedStartTime,
                                language,
                                'floor',
                              )}
                          </ThemeText>
                        )}
                        {isSignificantDifference(leg) && (
                          <ThemeText
                            style={styles.scheduledTime}
                            typography="body__tertiary--strike"
                            color="secondary"
                            testID={'aimTime' + i}
                          >
                            {formatToClock(
                              leg.aimedStartTime,
                              language,
                              'floor',
                            )}
                          </ThemeText>
                        )}
                      </View>
                    </View>
                    {displayLegDash(i) ? (
                      <View style={[styles.dashContainer, iconHeight]}>
                        <LegDash />
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
              {collapsedLegs.length ? (
                <View style={[styles.dashContainer, iconHeight]}>
                  <LegDash />
                </View>
              ) : null}
              <CounterIconBox
                count={collapsedLegs.length}
                spacing="standard"
                textType="body__primary--bold"
              />
            </View>
            <View style={[styles.destinationLineContainer_grow, iconHeight]}>
              <View style={[styles.destinationLine_grow, lineHeight]} />
            </View>
          </View>
          <View style={[styles.destinationLineContainer, iconHeight]}>
            <View style={[styles.destinationLine, lineHeight]} />
          </View>
          <View>
            <DestinationIcon style={styles.iconContainer} />
            <View style={styles.departureTimes}>
              <ThemeText
                typography="body__tertiary"
                color="primary"
                testID="endTime"
              >
                {(lastLegIsFlexible
                  ? t(dictionary.missingRealTimePrefix)
                  : '') +
                  formatToClock(tripPattern.expectedEndTime, language, 'ceil')}
              </ThemeText>
            </View>
          </View>
        </View>
        <ResultItemFooter tripPattern={tripPattern} />
      </Animated.View>
    </PressableOpacity>
  );
};

export const MemoizedResultItem = React.memo(ResultItem);

const ResultItemFooter: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const now = useNow(30000);
  const tripPatternBookingStatus = getTripPatternBookingStatus(
    tripPattern,
    now,
  );
  const bookingText = getTripPatternBookingText(tripPatternBookingStatus, t);

  return (
    <View style={styles.resultFooter}>
      <View style={styles.footerNotice}>
        {bookingText && (
          <MessageInfoText
            message={bookingText}
            type={tripPatternBookingStatus === 'late' ? 'error' : 'warning'}
          />
        )}
      </View>
      <View style={styles.detailsTextWrapper}>
        <ThemeText typography="body__secondary">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  pressableOpacity: {
    marginTop: theme.spacing.small,
  },
  result: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
  resultInPast: {
    backgroundColor: theme.color.background.neutral[2].background,
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.small,
    flexDirection: 'row',
  },
  lineContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  legLine: {
    backgroundColor: theme.color.background.neutral[3].background,
    flexDirection: 'row',
    borderRadius: theme.border.radius.regular,
    width: 5,
  },
  leftLegLine: {
    marginLeft: theme.spacing.xSmall,
    marginRight: 2,
  },
  rightLegLine: {
    marginRight: theme.spacing.xSmall,
  },
  destinationLineContainer_grow: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  destinationLineContainer: {
    justifyContent: 'center',
    width: theme.spacing.large,
  },
  destinationLine_grow: {
    backgroundColor: theme.color.background.neutral[3].background,
    marginLeft: theme.spacing.xSmall,
    borderBottomLeftRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
  },
  destinationLine: {
    backgroundColor: theme.color.background.neutral[3].background,
    marginRight: theme.spacing.xSmall,
    borderBottomRightRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
  iconContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    borderRadius: theme.border.radius.small,
    alignItems: 'center',
  },
  walkContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: theme.border.radius.small,
  },
  walkDuration: {
    fontSize: 10,
    marginLeft: -2,
    color: theme.color.foreground.dynamic.primary,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  transportationIcon_wide: {
    flex: 1,
    justifyContent: 'center',
  },
  dashContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legOutput: {
    flexDirection: 'row',
  },
  legAndDash: {flexDirection: 'row'},
  departureTimes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: theme.spacing.xSmall,
  },
  scheduledTime: {
    marginLeft: theme.spacing.xSmall,
  },
  resultFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: theme.color.border.primary.background,
    borderTopWidth: theme.border.width.slim,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  footerNotice: {
    flexDirection: 'row',
  },
  fromPlaceText: {
    flex: 3,
  },
  detailsTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing.medium,
  },
  detailsIcon: {
    marginLeft: theme.spacing.xSmall,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  warningIcon: {
    marginLeft: theme.spacing.small,
  },
}));

const LegDash = () => {
  const styles = useThemeStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const lineHeight = {height: (theme.spacing.xSmall / 2) * fontScale};
  return (
    <>
      <View style={styles.lineContainer}>
        <View style={[styles.legLine, styles.leftLegLine, lineHeight]} />
      </View>
      <View style={styles.lineContainer}>
        <View style={[styles.legLine, styles.rightLegLine, lineHeight]} />
      </View>
    </>
  );
};
const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useThemeStyles();
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
          TripSearchTexts.results.resultItem.footLeg.walkAndWaitLabel(
            walkDuration,
            waitDuration,
          ),
        )
      : mustWait
      ? t(TripSearchTexts.results.resultItem.footLeg.waitLabel(waitDuration))
      : t(TripSearchTexts.results.resultItem.footLeg.walkLabel(walkDuration));

  return (
    <View style={styles.walkContainer} testID="footLeg">
      <ThemeIcon accessibilityLabel={a11yText} svg={Walk} />
      <Text style={styles.walkDuration}>{secondsToMinutes(leg.duration)}</Text>
    </View>
  );
};

const TransportationLeg = ({
  leg,
  style,
}: {
  leg: Leg;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TransportationIconBox
      style={style}
      mode={leg.mode}
      subMode={leg.line?.transportSubmode}
      isFlexible={isLineFlexibleTransport(leg.line)}
      lineNumber={leg.line?.publicCode}
      type="standard"
      testID={`${leg.mode}Leg`}
    />
  );
};

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
  listPosition: number,
) => {
  const distance = Math.round(tripPattern.legs[0].distance);
  let humanizedDistance;
  if (distance >= 1000) {
    humanizedDistance = `${distance / 1000} ${t(dictionary.distance.km)}`;
  } else {
    humanizedDistance = `${distance} ${t(dictionary.distance.m)}`;
  }

  let startText = '';

  if (tripPattern.legs[0]?.mode === 'foot' && tripPattern.legs[1]) {
    const quayName = getQuayName(tripPattern.legs[1]?.fromPlace.quay);

    {
      quayName
        ? (startText = t(
            TripSearchTexts.results.resultItem.footLeg.walkToStopLabel(
              humanizedDistance,
              quayName,
            ),
          ))
        : undefined;
    }
  } else {
    const quayName = getQuayName(tripPattern.legs[0]?.fromPlace.quay);
    if (quayName) {
      startText = t(
        TripSearchTexts.results.resultItem.header.title(
          t(getTranslatedModeName(tripPattern.legs[0].mode)),
          quayName,
        ),
      );
    }
  }

  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const firstLeg = nonFootLegs.length > 0 ? nonFootLegs[0] : undefined;

  const resultNumberText =
    t(
      TripSearchTexts.results.resultItem.journeySummary.resultNumber(
        listPosition,
      ),
    ) + screenReaderPause;
  const passedTripText = isInPast
    ? t(TripSearchTexts.results.resultItem.passedTrip)
    : undefined;

  const modeAndNumberText = firstLeg
    ? t(getTranslatedModeName(firstLeg.mode)) +
      (firstLeg.line?.publicCode
        ? t(
            TripSearchTexts.results.resultItem.journeySummary.prefixedLineNumber(
              firstLeg.line.publicCode,
            ),
          )
        : '')
    : undefined;

  const realTimeText = firstLeg
    ? isSignificantDifference(firstLeg)
      ? t(
          TripSearchTexts.results.resultItem.journeySummary.realtime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
            formatToClock(firstLeg.aimedStartTime, language, 'floor'),
          ),
        )
      : (isLineFlexibleTransport(firstLeg.line)
          ? t(dictionary.missingRealTimePrefix)
          : '') +
        t(
          TripSearchTexts.results.resultItem.journeySummary.noRealTime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
          ),
        )
    : undefined;

  const numberOfFootLegsText = !nonFootLegs.length
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
          nonFootLegs.length - 1,
        ),
      );

  const walkDistance = tripPattern.legs
    .filter((l) => l.mode === Mode.Foot)
    .reduce((tot, {distance}) => tot + distance, 0);
  const walkDistanceText = t(
    TripSearchTexts.results.resultItem.journeySummary.totalWalkDistance(
      walkDistance.toFixed(),
    ),
  );

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const startTimeIsApproximation =
    filteredLegs.length > 0 && isLineFlexibleTransport(filteredLegs[0].line);
  const endTimeIsApproximation =
    filteredLegs.length > 0 &&
    isLineFlexibleTransport(filteredLegs[filteredLegs.length - 1].line);

  const traveltimesText = t(
    TripSearchTexts.results.resultItem.journeySummary.travelTimes(
      formatToClock(tripPattern.expectedStartTime, language, 'floor'),
      formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
      secondsToDuration(tripPattern.duration, language),
      startTimeIsApproximation,
      endTimeIsApproximation,
    ),
  );

  const tripPatternBookingStatus = getTripPatternBookingStatus(tripPattern);
  const bookingText = getTripPatternBookingText(tripPatternBookingStatus, t);

  const texts = [
    resultNumberText,
    bookingText,
    passedTripText,
    startText,
    modeAndNumberText,
    realTimeText,
    numberOfFootLegsText,
    walkDistanceText,
    traveltimesText,
  ].filter((text) => text !== undefined);

  return texts.join(screenReaderPause);
};

function isSignificantDifference(leg: Leg) {
  return (
    getTimeRepresentationType({
      missingRealTime: !leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
    }) === 'significant-difference'
  );
}

const DestinationIcon = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return <ThemeIcon style={style} svg={Destination} />;
};

const getTripPatternBookingText = (
  tripPatternBookingStatus: TripPatternBookingStatus,
  t: TranslateFunction,
) => {
  switch (tripPatternBookingStatus) {
    case 'none':
      return undefined;
    case 'bookable':
      return t(TripSearchTexts.results.resultItem.footer.requiresBooking);
    case 'late':
      return t(TripSearchTexts.results.resultItem.footer.toLateForBooking);
  }
};
