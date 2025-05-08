import {usePreferencesContext} from '@atb/modules/preferences';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
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

  return undefined;
};
