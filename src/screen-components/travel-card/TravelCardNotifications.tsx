import React from 'react';
import {View} from 'react-native';
import type {TripPattern} from '@atb/api/types/trips';
import {
  getTextForLanguage,
  SituationsTexts,
  TripDetailsTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {
  findAllNotices,
  findAllSituations,
  getDetailedSituationOrNoticeA11yLabel,
  getLegNotificationsA11yLabel,
  getMsgTypeForLeg,
  getMessageTypeForSituation,
  toMostCriticalStatus,
} from '@atb/modules/situations';
import {MessageInfoText} from '@atb/components/message-info-text';
import type {Language} from '@atb/translations';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useAccessibilityLabelContribution} from '@atb/modules/composite-accessibility';
import type {Leg} from '@atb/api/types/trips';
import type {TranslateFunction} from '@atb/translations';
import {Statuses} from '@atb/theme';

type TravelCardNotificationsProps = {
  tripPattern: TripPattern;
  language: Language;
  includeSituationsAndNotices?: boolean;
  includeTransportInfo?: boolean;
};

export const TravelCardNotifications: React.FC<
  TravelCardNotificationsProps
> = ({
  tripPattern,
  language,
  includeSituationsAndNotices = false,
  includeTransportInfo = false,
}) => {
  const {t} = useTranslation();
  const showDetail = includeSituationsAndNotices || includeTransportInfo;

  const a11yLabel = showDetail
    ? [
        includeSituationsAndNotices
          ? getDetailedSituationOrNoticeA11yLabel(tripPattern, language, t)
          : undefined,
        includeTransportInfo
          ? getLegNotificationsA11yLabel(tripPattern, t)
          : undefined,
      ]
        .filter(Boolean)
        .join('. ')
    : getTripNotificationHint(tripPattern.legs, t);

  useAccessibilityLabelContribution('notifications', a11yLabel);

  if (!showDetail) return null;

  const situations = includeSituationsAndNotices
    ? findAllSituations(tripPattern)
    : [];
  const notices = includeSituationsAndNotices
    ? findAllNotices(tripPattern)
    : [];

  const transportItems: {key: string; message: string}[] = [];
  if (includeTransportInfo) {
    for (const leg of tripPattern.legs) {
      if (leg.transportSubmode === TransportSubmode.RailReplacementBus) {
        transportItems.push({
          key: `rail-replacement-${leg.id}`,
          message: t(TripDetailsTexts.messages.departureIsRailReplacementBus),
        });
      }
      if (leg.bookingArrangements) {
        transportItems.push({
          key: `booking-${leg.id}`,
          message: t(TripSearchTexts.results.resultItem.footer.requiresBooking),
        });
      }
    }
  }

  if (
    situations.length === 0 &&
    notices.length === 0 &&
    transportItems.length === 0
  )
    return null;

  return (
    <View aria-hidden={true}>
      {situations.map((situation) => (
        <MessageInfoText
          type={getMessageTypeForSituation(situation)}
          message={getTextForLanguage(situation.description, language) ?? ''}
          key={situation.id}
        />
      ))}
      {notices.map((notice) => (
        <MessageInfoText
          type="info"
          message={notice.text ?? ''}
          key={notice.id}
        />
      ))}
      {transportItems.map((item) => (
        <MessageInfoText type="warning" message={item.message} key={item.key} />
      ))}
    </View>
  );
};

const getTripNotificationHint = (
  legs: Leg[],
  t: TranslateFunction,
): string | undefined => {
  const msgType = legs
    .filter((leg) => leg.mode !== 'foot')
    .map(getMsgTypeForLeg)
    .reduce<Exclude<Statuses, 'valid'> | undefined>(
      toMostCriticalStatus,
      undefined,
    );
  return msgType
    ? t(SituationsTexts.tripSummary.withSuggestion[msgType])
    : undefined;
};
