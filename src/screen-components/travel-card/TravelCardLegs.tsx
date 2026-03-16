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

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {
  getFilteredLegsByWalkOrWaitTime,
  getNoticesForLeg,
  isLineFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
} from '@atb/screen-components/travel-details-screens';
import {Destination} from '@atb/assets/svg/mono-icons/places';
import {useFontScale} from '@atb/utils/use-font-scale';
import {isSignificantDifference} from './utils';

type ResultItemState = 'enabled' | 'dimmed' | 'disabled';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  state: ResultItemState;
};

export const TravelCardLegs: React.FC<
  TravelCardContentProps & AccessibilityProps
> = ({tripPattern, ...props}) => {
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
  const [hasMinimumOfExpandedLegs, setHasMinimumOfExpandedLegs] =
    useState(false);

  // Dynamically collapse legs to fit horizontally
  useLayoutEffect(() => {
    if (legIconsParentWidth && legIconsContentWidth) {
      if (
        legIconsContentWidth >= legIconsParentWidth &&
        !hasMinimumOfExpandedLegs
      ) {
        setNumberOfExpandedLegs((val) => Math.max(val - 1, 1));
      }
    }
  }, [legIconsParentWidth, legIconsContentWidth, hasMinimumOfExpandedLegs]);

  useLayoutEffect(() => {
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

  const staySeated = (idx: number): boolean => {
    const previousLeg = expandedLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  const isIntermediateFootLeg = (leg: Leg, index: number): boolean => {
    return leg.mode === 'foot' && index !== 0;
  };

  return (
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
                </View>
              </View>
            ))}
          </View>
          <CounterIconBox
            count={collapsedLegs.length}
            spacing="standard"
            textType="body__m__strong"
          />
        </View>
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  lineContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
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
    borderRadius: theme.border.radius.regular,
    alignItems: 'center',
  },
  walkContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: theme.border.radius.regular,
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
    gap: theme.spacing.small,
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
    gap: theme.spacing.xSmall,
  },
  legAndDash: {flexDirection: 'row'},
  departureTimes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.xSmall,
    marginHorizontal: theme.spacing.xSmall,
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
