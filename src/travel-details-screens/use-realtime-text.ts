import {usePreferencesContext} from '@atb/preferences';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {formatToClock, isInThePast} from '@atb/utils/date';
import {getTimeRepresentationType} from '@atb/travel-details-screens/utils';
import {ServiceJourneyEstimatedCall} from '@atb/api/types/trips';

export const useRealtimeText = (
  estimatedCalls: Omit<ServiceJourneyEstimatedCall, 'predictionInaccurate'>[],
) => {
  const lastPassedStop = estimatedCalls
    .filter((a) => a.actualDepartureTime)
    .pop();
  const {t, language} = useTranslation();
  const {
    preferences: {debugShowSeconds},
  } = usePreferencesContext();

  if (lastPassedStop && lastPassedStop.quay?.name) {
    return t(
      DepartureDetailsTexts.lastPassedStop(
        lastPassedStop.quay.name,
        formatToClock(
          lastPassedStop.actualDepartureTime,
          language,
          'round',
          debugShowSeconds,
        ),
      ),
    );
  }

  const firstStop = estimatedCalls[0];

  if (
    firstStop?.quay?.name &&
    firstStop.realtime &&
    !isInThePast(firstStop.expectedDepartureTime)
  ) {
    return t(
      DepartureDetailsTexts.noPassedStop(
        firstStop.quay.name,
        formatToClock(
          firstStop.expectedDepartureTime,
          language,
          'floor',
          debugShowSeconds,
        ),
      ),
    );
  }
  const timeRepType = getTimeRepresentationType({
    missingRealTime: !firstStop?.realtime,
    aimedTime: firstStop?.aimedDepartureTime,
    expectedTime: firstStop?.expectedDepartureTime,
  });
  switch (timeRepType) {
    case 'no-significant-difference':
      return t(DepartureDetailsTexts.onTime);
    case 'significant-difference':
      return t(DepartureDetailsTexts.notOnTime);
    default:
      return undefined;
  }
};
