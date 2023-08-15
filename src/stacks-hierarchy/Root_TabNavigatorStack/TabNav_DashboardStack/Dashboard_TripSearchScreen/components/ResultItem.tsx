import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Walk} from '@atb/assets/svg/mono-icons/transportation';
import {
  AccessibleText,
  screenReaderPause,
  ThemeText,
} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CounterIconBox, TransportationIconBox} from '@atb/components/icon-box';
import {Info, Warning} from '@atb/assets/svg/color/icons/status';
import {SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
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
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {SearchTime} from '@atb/journey-date-picker';
import {RailReplacementBusMessage} from './RailReplacementBusMessage';
import {
  getNoticesForLeg,
  getTimeRepresentationType,
  isSignificantFootLegWalkOrWaitTime,
  significantWaitTime,
  significantWalkTime,
  isLegFlexibleTransport,
  getBookingRequirementForTripPattern,
} from '@atb/travel-details-screens/utils';
import {Destination} from '@atb/assets/svg/mono-icons/places';
import {useFontScale} from '@atb/utils/use-font-scale';

import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useNow} from '@atb/utils/use-now';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
  searchTime: SearchTime;
  testID?: string;
  resultNumber: number;
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
  const startLegIsFlexibleTransport = isLegFlexibleTransport(start);
  const publicCode = start.fromPlace.quay?.publicCode || start.line?.publicCode;

  const durationText = secondsToDurationShort(tripPattern.duration, language);
  const transportName = t(getTranslatedModeName(start.mode));

  return (
    <View style={styles.resultHeader}>
      <ThemeText
        style={styles.fromPlaceText}
        type={'body__secondary--bold'}
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

export const ResultItem: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  testID,
  searchTime,
  resultNumber,
  ...props
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const fontScale = useFontScale();
  const [legIconsParentWidth, setLegIconsParentWidth] = useState(0);
  const [legIconsContentWidth, setLegIconsContentWidth] = useState(0);

  const [numberOfExpandedLegs, setNumberOfExpandedLegs] = useState(
    tripPattern.legs.length,
  );
  const fadeInValue = useRef(new Animated.Value(0)).current;

  const now = useNow(2500);
  const {flex_booking_number_of_days_available} = useRemoteConfig();

  // Dynamically collapse legs to fit horizontally
  useEffect(() => {
    if (legIconsParentWidth && legIconsContentWidth) {
      if (legIconsContentWidth >= legIconsParentWidth) {
        setNumberOfExpandedLegs((val) => val - 1);
      } else {
        fadeIn.start();
      }
    }
  }, [legIconsParentWidth, legIconsContentWidth]);

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
  const iconHeight = {
    height: theme.icon.size['normal'] * fontScale + theme.spacings.small * 2,
  };
  const lineHeight = {height: (theme.spacings.xSmall / 2) * fontScale};

  return (
    <TouchableOpacity
      accessibilityLabel={tripSummary(
        tripPattern,
        t,
        language,
        isInPast,
        resultNumber,
        now,
        flex_booking_number_of_days_available,
      )}
      accessibilityHint={t(
        TripSearchTexts.results.resultItem.footer.detailsHint,
      )}
      accessibilityRole={'button'}
      style={styles.touchableOpacity}
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
                {legs.map((leg, i) => (
                  <View
                    key={tripPattern.compressedQuery + leg.aimedStartTime}
                    style={styles.legAndDash}
                  >
                    <View testID="tripLeg">
                      {leg.mode === 'foot' ? (
                        <FootLeg leg={leg} nextLeg={tripPattern.legs[i + 1]} />
                      ) : (
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
                        <ThemeText
                          type="body__tertiary"
                          color="primary"
                          testID={'schTime' + i}
                        >
                          {(isLegFlexibleTransport(leg) ? 'ca. ' : '') +
                            formatToClock(
                              leg.expectedStartTime,
                              language,
                              'floor',
                            )}
                        </ThemeText>
                        {isSignificantDifference(leg) && (
                          <ThemeText
                            style={styles.scheduledTime}
                            type="body__tertiary--strike"
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
                    {i < legs.length - 1 ? (
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
              <CounterIconBox count={collapsedLegs.length} />
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
              <ThemeText type="body__tertiary" color="primary" testID="endTime">
                {formatToClock(tripPattern.expectedEndTime, language, 'ceil')}
              </ThemeText>
            </View>
          </View>
        </View>
        <ResultItemFooter tripPattern={tripPattern} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const ResultItemFooter: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const now = useNow(2500);
  const {flex_booking_number_of_days_available} = useRemoteConfig();

  const {requiresBooking, requiresBookingUrgently} =
    getBookingRequirementForTripPattern(
      tripPattern,
      now,
      flex_booking_number_of_days_available,
    );

  return (
    <View style={styles.resultFooter}>
      <View style={styles.footerNotice}>
        {requiresBooking && (
          <>
            <ThemeIcon
              svg={requiresBookingUrgently ? Warning : Info}
              style={styles.footerNoticeIcon}
            />
            <ThemeText type="body__secondary" color="secondary">
              {t(TripSearchTexts.results.resultItem.footer.requiresBooking)}
            </ThemeText>
          </>
        )}
      </View>
      <View style={styles.detailsTextWrapper}>
        <ThemeText type="body__secondary">
          {t(TripSearchTexts.results.resultItem.footer.detailsLabel)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} style={styles.detailsIcon} />
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  touchableOpacity: {
    marginTop: theme.spacings.small,
  },
  result: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
  },
  resultInPast: {
    backgroundColor: theme.static.background.background_2.background,
  },
  detailsContainer: {
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.medium,
    paddingBottom: theme.spacings.small,
    flexDirection: 'row',
  },
  lineContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  legLine: {
    backgroundColor: theme.static.background.background_3.background,
    flexDirection: 'row',
    borderRadius: theme.border.radius.regular,
    width: 5,
  },
  leftLegLine: {
    marginLeft: theme.spacings.xSmall,
    marginRight: 2,
  },
  rightLegLine: {
    marginRight: theme.spacings.xSmall,
  },
  destinationLineContainer_grow: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  destinationLineContainer: {
    justifyContent: 'center',
    width: theme.spacings.large,
  },
  destinationLine_grow: {
    backgroundColor: theme.static.background.background_3.background,
    marginLeft: theme.spacings.xSmall,
    borderBottomLeftRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
  },
  destinationLine: {
    backgroundColor: theme.static.background.background_3.background,
    marginRight: theme.spacings.xSmall,
    borderBottomRightRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
  iconContainer: {
    backgroundColor: theme.static.background.background_2.background,
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
  },
  walkContainer: {
    backgroundColor: theme.static.background.background_2.background,
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: theme.border.radius.small,
  },
  walkDuration: {
    fontSize: 10,
    marginLeft: -2,
    color: theme.text.colors.primary,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.medium,
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
    marginVertical: theme.spacings.xSmall,
  },
  scheduledTime: {
    marginLeft: theme.spacings.xSmall,
  },
  resultFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: theme.border.primary,
    borderTopWidth: theme.border.width.slim,
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
  },
  footerNotice: {
    flexDirection: 'row',
  },
  footerNoticeIcon: {
    paddingRight: theme.spacings.small,
  },
  fromPlaceText: {
    flex: 3,
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
    flex: 1,
    alignItems: 'flex-end',
  },
  warningIcon: {
    marginLeft: theme.spacings.small,
  },
}));

const LegDash = () => {
  const styles = useThemeStyles();
  const {theme} = useTheme();
  const fontScale = useFontScale();
  const lineHeight = {height: (theme.spacings.xSmall / 2) * fontScale};
  return (
    <>
      <View style={styles.lineContainer}>
        <View style={[styles.legLine, styles.leftLegLine, lineHeight]}></View>
      </View>
      <View style={styles.lineContainer}>
        <View style={[styles.legLine, styles.rightLegLine, lineHeight]}></View>
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
    <View style={styles.walkContainer} testID="fLeg">
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
      mode={isLegFlexibleTransport(leg) ? 'flex' : leg.mode}
      subMode={leg.line?.transportSubmode}
      lineNumber={leg.line?.publicCode}
      testID="trLeg"
    />
  );
};

const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
  listPosition: number,
  now: number,
  flex_booking_number_of_days_available: number,
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
      : t(
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

  const walkDistanceText = t(
    TripSearchTexts.results.resultItem.journeySummary.totalWalkDistance(
      (tripPattern.walkDistance ?? 0).toFixed(),
    ),
  );

  const traveltimesText = t(
    TripSearchTexts.results.resultItem.journeySummary.travelTimes(
      formatToClock(tripPattern.expectedStartTime, language, 'floor'),
      formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
      secondsToDuration(tripPattern.duration, language),
    ),
  );

  const {requiresBooking} = getBookingRequirementForTripPattern(
    tripPattern,
    now,
    flex_booking_number_of_days_available,
  );
  const requiresBookingText = requiresBooking
    ? t(TripSearchTexts.results.resultItem.footer.requiresBooking)
    : undefined;

  const texts = [
    resultNumberText,
    requiresBookingText,
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
