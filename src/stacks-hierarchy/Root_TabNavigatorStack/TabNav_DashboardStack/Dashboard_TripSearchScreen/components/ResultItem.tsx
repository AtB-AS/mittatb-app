import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {AccessibleText, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CounterIconBox, TransportationIconBox} from '@atb/components/icon-box';
import {SituationOrNoticeIcon} from '@atb/modules/situations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {dictionary, TripSearchTexts, useTranslation} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {flatMap} from '@atb/utils/array';
import {
  formatToClock,
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
import {RailReplacementBusMessage} from './RailReplacementBusMessage';
import {
  getFilteredLegsByWalkOrWaitTime,
  getNoticesForLeg,
  isLineFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
} from '@atb/screen-components/travel-details-screens';
import {Destination} from '@atb/assets/svg/mono-icons/places';
import {useFontScale} from '@atb/utils/use-font-scale';
import {isSignificantDifference} from '../utils';

type ResultItemState = 'enabled' | 'dimmed' | 'disabled';

type ResultItemProps = {
  tripPattern: TripPattern;
  state: ResultItemState;
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
  ...props
}) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const [legIconsParentWidth, setLegIconsParentWidth] = useState(0);
  const [legIconsContentWidth, setLegIconsContentWidth] = useState(0);

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

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
    <Animated.View
      style={[{opacity: fadeInValueRef.current}, styles.container]}
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
                          {formatToClock(leg.aimedStartTime, language, 'floor')}
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
              {(lastLegIsFlexible ? t(dictionary.missingRealTimePrefix) : '') +
                formatToClock(tripPattern.expectedEndTime, language, 'ceil')}
            </ThemeText>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const MemoizedResultItem = React.memo(ResultItem);

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.medium,
  },
  detailsContainer: {
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
    marginTop: theme.spacing.xSmall,
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
  footerNotice: {flex: 1},
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
      <ThemeIcon accessibilityLabel={a11yText} svg={WalkFill} />
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

const DestinationIcon = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return <ThemeIcon style={style} svg={Destination} />;
};
