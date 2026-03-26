import {TravelCardTexts, useTranslation} from '@atb/translations';
import {isInThePast} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';

import {TripPattern} from '@atb/api/types/trips';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {computeAimedStartEndTimes} from './utils';

export const useTripPatternInfo = (tripPattern: TripPattern) => {
  const {t} = useTranslation();
  let from = tripPattern.legs[0];
  let fromName = from.fromPlace.name;
  const to = tripPattern.legs[tripPattern.legs.length - 1];
  const toName = to.toPlace.name ?? '';
  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    from = tripPattern.legs[1];
    fromName = getQuayName(from.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    fromName = getQuayName(from.fromPlace.quay);
  }

  const startLegIsFlexibleTransport = isLineFlexibleTransport(from.line);
  const transportName = t(getTranslatedModeName(from.mode));
  const publicCode = from.fromPlace.quay?.publicCode || from.line?.publicCode;

  fromName = fromName
    ? fromName
    : startLegIsFlexibleTransport && publicCode
      ? t(TravelCardTexts.header.flexTransportInfo(publicCode))
      : transportName;

  const {expectedStartTime, expectedEndTime} = tripPattern;
  const {aimedStartTime, aimedEndTime} = computeAimedStartEndTimes(tripPattern);

  const isInPast = isInThePast(expectedEndTime);

  return {
    fromName,
    toName,
    expectedStartTime,
    expectedEndTime,
    aimedStartTime,
    aimedEndTime,
    isInPast,
  };
};
