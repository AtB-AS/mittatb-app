import React from 'react';
import {View} from 'react-native';
import type {TripPattern} from '@atb/api/types/trips';
import {getTextForLanguage} from '@atb/translations';
import {
  findAllNotices,
  findAllSituations,
  getMessageTypeForSituation,
} from '@atb/modules/situations';
import {MessageInfoText} from '@atb/components/message-info-text';
import type {Language} from '@atb/translations';

type TravelCardNoticesProps = {
  tripPattern: TripPattern;
  language: Language;
};

export const TravelCardNotices: React.FC<TravelCardNoticesProps> = ({
  tripPattern,
  language,
}) => {
  const notices = findAllNotices(tripPattern);
  const situations = findAllSituations(tripPattern);

  if (situations.length === 0 && notices.length === 0) return null;

  return (
    <View aria-hidden={true}>
      {situations.map((situation) => (
        <MessageInfoText
          type={getMessageTypeForSituation(situation)}
          message={getTextForLanguage(situation.description, language) ?? ''}
        />
      ))}
      {notices.map((notice) => (
        <MessageInfoText
          type="info"
          message={notice.text ?? ''}
          key={notice.id}
        />
      ))}
    </View>
  );
};
