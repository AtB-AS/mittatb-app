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

import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {
  getFilteredLegsByWalkOrWaitTime,
  isLineFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
} from '@atb/screen-components/travel-details-screens';
import {isSignificantDifference} from './utils';
import {useIconSize} from '@atb/components/theme-icon';
import {MAX_FONT_SCALE, useTypographyTextStyle} from '@atb/components/text';
import {useFontScale} from '@atb/utils/use-font-scale';

type ResultItemState = 'enabled' | 'dimmed' | 'disabled';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  state: ResultItemState;
};

const MAX_WIDTH = 300;

export const TravelCardLegs: React.FC<
  TravelCardContentProps & AccessibilityProps
> = ({tripPattern}) => {
  const styles = useThemeStyles();
  const legOutputRef = useRef<View>(null);
  const counterIconBoxRef = useRef<View>(null);
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  const staySeated = (idx: number): boolean => {
    const previousLeg = filteredLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  useLayoutEffect(() => {
    if (filteredLegs.length < 3) return;
    //const width = legOutputRef.current?.getBoundingClientRect().width;
    //const counterIconBoxWidth =
    //  counterIconBoxRef.current?.getBoundingClientRect().width;

    //if (width > MAX_WIDTH) {
    //  setMaxWidth(MAX_WIDTH);
    //}
  }, [filteredLegs]);

  return (
    <View style={styles.detailsContainer} {...screenReaderHidden}>
      <View style={styles.flexRow}>
        <View
          style={[
            styles.row,
            {backgroundColor: 'red', overflow: 'hidden', maxWidth: maxWidth},
          ]}
        >
          <View style={styles.legs} ref={legOutputRef}>
            {filteredLegs.map((leg, i) => (
              <View key={tripPattern.compressedQuery + leg.aimedStartTime}>
                <View testID="tripLeg">
                  {leg.mode === 'foot' ? (
                    <FootLeg leg={leg} nextLeg={filteredLegs[i + 1]} />
                  ) : staySeated(i) ? null : (
                    <TransportationLeg leg={leg} />
                  )}
                </View>
              </View>
            ))}
          </View>
          <CounterIconBox
            ref={counterIconBoxRef}
            count={0}
            spacing="standard"
            textType="body__m__strong"
            hideIfZero={false}
          />
        </View>
      </View>
    </View>
  );
};

const useVisibleLegs = (legs: Leg[], maxWidth: number) => {
  const {theme} = useThemeContext();
  const styles = useThemeStyles();
  const fontScale = useFontScale();
  const iconSize = useIconSize();
  const legsGap = styles.legs.gap;
  const legHorizontalPadding = theme.spacing.small * 3; // the two sides + text and icon padding
  const typographyTextStyle = useTypographyTextStyle('body__m__strong');
  const multiplier = Math.min(fontScale, MAX_FONT_SCALE);
  const estimatedTextWidthPerCharacter =
    typographyTextStyle.fontSize! * multiplier;

  return useMemo(() => {
    let totalWidth = 0;

    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];

      let textWidth = 0;
      if (leg.mode === 'foot') {
        const minutes = secondsToMinutes(leg.duration).toString();
        textWidth =
          minutes.length * (theme.typography.body__m__strong.fontSize * 0.5);
      } else if (leg.line?.publicCode) {
        textWidth =
          leg.line.publicCode.length *
            (theme.typography.body__m__strong.fontSize * 0.6) +
          theme.spacing.xSmall;
      }

      const legWidth = iconSize + padding + textWidth;
      const gapWidth = i > 0 ? gap : 0;

      // Reserve space for "+N" counter
      const counterReserve = i < legs.length - 1 ? 50 : 0; // ~50px for "+N"

      if (totalWidth + legWidth + gapWidth + counterReserve > maxWidth) {
        return {
          visibleCount: i,
          hiddenCount: legs.length - i,
        };
      }

      totalWidth += legWidth + gapWidth;
    }

    return {
      visibleCount: legs.length,
      hiddenCount: 0,
    };
  }, [legs, maxWidth, theme]);
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
    alignItems: 'flex-end',
    borderRadius: theme.border.radius.regular,
  },
  walkDuration: {
    fontSize: 10,
    marginLeft: -2,
    color: theme.color.foreground.dynamic.primary,
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
  legs: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
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
