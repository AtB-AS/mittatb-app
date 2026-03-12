import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CounterIconBox, TransportationIconBox} from '@atb/components/icon-box';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {screenReaderHidden} from '@atb/utils/accessibility';
import {
  secondsBetween,
  secondsToDuration,
  secondsToMinutes,
} from '@atb/utils/date';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {
  getFilteredLegsByWalkOrWaitTime,
  isLineFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
} from '@atb/screen-components/travel-details-screens';
import {ThemeText} from '@atb/components/text';
import Animated, {Easing, FadeIn} from 'react-native-reanimated';
import {OverflowContainer} from '@atb/components/overflow-container';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  maxWidth: number;
};

export const TravelCardLegs: React.FC<TravelCardContentProps> = ({
  tripPattern,
  maxWidth,
}) => {
  const {theme} = useThemeContext();
  const styles = useThemeStyles();
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const staySeated = (idx: number): boolean => {
    const previousLeg = filteredLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  return (
    <View style={styles.detailsContainer} {...screenReaderHidden}>
      <View style={styles.flexRow}>
        <View style={styles.row}>
          <View style={styles.legs}>
            <OverflowContainer
              maxWidth={maxWidth}
              gap={theme.spacing.xSmall}
              overflow={(n) => (
                <CounterIconBox
                  count={n}
                  spacing="standard"
                  textType="body__m__strong"
                />
              )}
            >
              {filteredLegs.map((leg, i) => (
                <View key={`leg-${leg.id ?? i}`}>
                  <Animated.View
                    entering={FadeIn.duration(200).easing(
                      Easing.inOut(Easing.ease),
                    )}
                    testID="tripLeg"
                  >
                    {leg.mode === 'foot' ? (
                      <FootLeg leg={leg} nextLeg={filteredLegs[i + 1]} />
                    ) : staySeated(i) ? null : (
                      <TransportationLeg leg={leg} />
                    )}
                  </Animated.View>
                </View>
              ))}
            </OverflowContainer>
          </View>
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
  walkContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
  walkDuration: {
    color: theme.color.foreground.dynamic.primary,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  legs: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    flexWrap: 'wrap',
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
      <ThemeText style={styles.walkDuration}>
        {secondsToMinutes(leg.duration)}
      </ThemeText>
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
