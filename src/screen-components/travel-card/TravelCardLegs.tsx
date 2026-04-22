import {CounterIconBox} from '@atb/components/icon-box';
import {StyleSheet, useThemeContext, Statuses} from '@atb/theme';
import {Mode} from '@atb-as/theme';
import React from 'react';
import {View} from 'react-native';
import {Leg, TripPattern} from '@atb/api/types/trips';
import {getFilteredLegsByWalkOrWaitTime} from '@atb/screen-components/travel-details-screens';
import {OverflowContainer} from '@atb/components/overflow-container';
import {
  getNotificationSvgForLegs,
  getLegsNotificationA11yLabel,
  getMsgTypeForLeg,
  toMostCriticalStatus,
} from '@atb/modules/situations';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {isShortWaitTime, significantWaitTime} from '@atb/modules/trip-patterns';
import {secondsBetween} from '@atb/utils/date';
import {TransportationLeg, FootLeg} from './legs';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import {useAccessibilityLabelContribution} from '@atb/modules/composite-accessibility';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {isDefined} from '@atb/utils/presence';
import type {TravelCardType} from './TravelCard';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  maxWidth: number;
  type: TravelCardType;
};

export const TravelCardLegs: React.FC<TravelCardContentProps> = ({
  tripPattern,
  maxWidth,
  type,
}) => {
  const {theme, themeName} = useThemeContext();
  const styles = useThemeStyles();
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const staySeated = (idx: number): boolean => {
    const previousLeg = filteredLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  const a11yLabel = useA11yLabel(filteredLegs, type);
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
                    <TransportationLeg
                      leg={leg}
                      notification={getNotificationForLeg(
                        leg,
                        filteredLegs,
                        i,
                        themeName,
                      )}
                    />
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

const useA11yLabel = (legs: Leg[], type: TravelCardType) => {
  const {t, language} = useTranslation();

  if (legs.length === 0) return '';

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

  const notificationLabel =
    type !== 'booking' ? getLegsNotificationA11yLabel(legs, t) : undefined;
  const prefix = t(TravelCardTexts.legs.prefix);
  const legsLabel = legs
    .map((leg, idx) =>
      [legLabel(leg), waitLabel(leg, legs[idx + 1])]
        .filter(isDefined)
        .join('. '),
    )
    .join(', ');

  return [notificationLabel, `${prefix}: ${legsLabel}`]
    .filter(isDefined)
    .join(', ');
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

function getNotificationForLeg(
  leg: Leg,
  legs: Leg[],
  index: number,
  themeName: Mode,
) {
  const previousLeg = legs[index - 1];
  const waitTimeInSeconds = previousLeg
    ? secondsBetween(previousLeg.expectedEndTime, leg.expectedStartTime)
    : 0;
  const shortTransferMsgType: Exclude<Statuses, 'valid'> | undefined =
    isShortWaitTime(waitTimeInSeconds) ? 'info' : undefined;
  const msgType = toMostCriticalStatus(
    getMsgTypeForLeg(leg),
    shortTransferMsgType,
  );
  return msgType && statusTypeToIcon(msgType, true, themeName);
}

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
