import {Language, translation as _} from '../commons';
import {formatToVerboseDateTime} from '@atb/utils/date';

const FlexibleTransportText = {
  contactMessage: {
    title: (phoneNumber: string) =>
      _(
        `Ring ${phoneNumber} for å bestille sete`,
        `Call ${phoneNumber} to reserve a seat`,
      ),
    callAction: (phoneNumber: string) =>
      _(`Ring ${phoneNumber}`, `Call ${phoneNumber}`),
  },
  infoMessage: (aimedStartTime: Date | string, language: Language) => {
    return _(
      `Fleksibel transport for denne reisen krever bestilling før ${formatToVerboseDateTime(
        aimedStartTime,
        language,
      )}`,
      `Flexible transport for this journey requires advance booking ${formatToVerboseDateTime(
        aimedStartTime,
        language,
      )}`,
    );
  },
};

export default FlexibleTransportText;
