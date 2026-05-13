import React from 'react';
import {View} from 'react-native';
import type {TripPattern} from '@atb/api/types/trips';
import {
  getTextForLanguage,
  TripDetailsTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {
  findAllNotices,
  findAllSituations,
  getMessageTypeForSituation,
} from '@atb/modules/situations';
import {MessageInfoText} from '@atb/components/message-info-text';
import type {Language} from '@atb/translations';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';

type TravelCardNoticesProps = {
  tripPattern: TripPattern;
  language: Language;
  includeSituationNotices?: boolean;
  includeLegNotifications?: boolean;
};

export const TravelCardNotices: React.FC<TravelCardNoticesProps> = ({
  tripPattern,
  language,
  includeSituationNotices = false,
  includeLegNotifications = false,
}) => {
  const {t} = useTranslation();

  const situations = includeSituationNotices
    ? findAllSituations(tripPattern)
    : [];
  const notices = includeSituationNotices ? findAllNotices(tripPattern) : [];

  const legNotifications: {key: string; message: string}[] = [];
  if (includeLegNotifications) {
    for (const leg of tripPattern.legs) {
      if (leg.transportSubmode === TransportSubmode.RailReplacementBus) {
        legNotifications.push({
          key: `rail-replacement-${leg.id}`,
          message: t(TripDetailsTexts.messages.departureIsRailReplacementBus),
        });
      }
      if (leg.bookingArrangements) {
        legNotifications.push({
          key: `booking-${leg.id}`,
          message: t(TripSearchTexts.results.resultItem.footer.requiresBooking),
        });
      }
    }
  }

  if (
    situations.length === 0 &&
    notices.length === 0 &&
    legNotifications.length === 0
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
      {legNotifications.map((notification) => (
        <MessageInfoText
          type="warning"
          message={notification.message}
          key={notification.key}
        />
      ))}
    </View>
  );
};
