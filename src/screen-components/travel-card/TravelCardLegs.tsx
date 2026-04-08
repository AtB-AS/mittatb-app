import {CounterIconBox} from '@atb/components/icon-box';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {
  getFilteredLegsByWalkOrWaitTime,
  significantWaitTime,
} from '@atb/screen-components/travel-details-screens';
import {OverflowContainer} from '@atb/components/overflow-container';
import {
  getNotificationSvgForLegs,
  getTripNotificationA11yLabel,
} from '@atb/modules/situations';
import {TransportationLeg, FootLeg} from './legs';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsBetween, secondsToDuration} from '@atb/utils/date';
import {useAccessibilityLabelContribution} from '@atb/modules/composite-accessibility';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {isDefined} from '@atb/utils/presence';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  maxWidth: number;
};

export const TravelCardLegs: React.FC<TravelCardContentProps> = ({
  tripPattern,
  maxWidth,
}) => {
  const {theme, themeName} = useThemeContext();
  const styles = useThemeStyles();
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const staySeated = (idx: number): boolean => {
    const previousLeg = filteredLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  const a11yLabel = useA11yLabel(filteredLegs);
  useAccessibilityLabelContribution('legs', a11yLabel);

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.flexRow}>
        <View style={styles.row}>
          <View style={styles.legs}>
            <OverflowContainer
              maxWidth={maxWidth}
              gap={theme.spacing.xSmall}
              overflow={(n) => {
                const overflowNotification = getNotificationSvgForLegs(
                  filteredLegs.slice(-n),
                  themeName,
                );
                return (
                  <CounterIconBox
                    count={n}
                    spacing="standard"
                    textType="body__m__strong"
                    notification={overflowNotification}
                  />
                );
              }}
            >
              {filteredLegs.map((leg, i) => (
                <View key={`leg-${leg.id ?? i}`}>
                  {leg.mode === 'foot' ? (
                    <FootLeg leg={leg} />
                  ) : staySeated(i) ? null : (
                    <TransportationLeg leg={leg} />
                  )}
                </View>
              ))}
            </OverflowContainer>
          </View>
        </View>
      </View>
    </View>
  );
};

const useA11yLabel = (legs: Leg[]) => {
  const {t, language} = useTranslation();

  const legLabel = (leg: Leg): string => {
    if (leg.mode === 'foot') {
      return t(
        TravelCardTexts.legs.foot.a11yLabel(
          secondsToDuration(leg.duration ?? 0, language),
        ),
      );
    }
    return t(
      TravelCardTexts.legs.transportation.a11yLabel(
        t(getTranslatedModeName(leg.mode, leg.line?.transportSubmode)),
        leg.line?.publicCode ?? '',
      ),
    );
  };

  const waitLabel = (leg: Leg, nextLeg?: Leg): string | undefined => {
    const waitTime = getWaitTime(leg, nextLeg);
    if (!waitTime.mustWait) return undefined;
    return t(
      TravelCardTexts.legs.wait.a11yLabel(
        secondsToDuration(waitTime.duration, language),
      ),
    );
  };

  const parts: string[] = legs.map((leg, idx) =>
    [legLabel(leg), waitLabel(leg, legs[idx + 1])].filter(isDefined).join('. '),
  );

  const notificationLabel = getTripNotificationA11yLabel(legs, t);
  if (notificationLabel) {
    parts.push(notificationLabel);
  }

  if (parts.length === 0) return '';

  const prefix = t(TravelCardTexts.legs.prefix);
  return `${prefix}: ${parts.join(', ')}`;
};

const getWaitTime = (leg: Leg, nextLeg?: Leg) => {
  if (!nextLeg) {
    return {duration: 0, mustWait: false};
  }

  const waitTimeInSeconds = secondsBetween(
    leg.expectedEndTime,
    nextLeg.expectedStartTime,
  );

  return {
    duration: waitTimeInSeconds,
    mustWait: significantWaitTime(waitTimeInSeconds),
  };
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
