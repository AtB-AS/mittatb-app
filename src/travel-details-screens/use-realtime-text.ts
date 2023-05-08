import {usePreferences} from '@atb/preferences';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {EstimatedCallWithMetadata} from '@atb/travel-details-screens/use-departure-data';
import {formatToClock, isInThePast} from '@atb/utils/date';
import {getTimeRepresentationType} from '@atb/travel-details-screens/utils';

export const useRealtimeText = (
  estimatedCallsWithMetadata: EstimatedCallWithMetadata[],
) => {
  const lastPassedStop = estimatedCallsWithMetadata
    .filter((a) => a.actualDepartureTime)
    .pop();
  const {t, language} = useTranslation();
  const {
    preferences: {debugShowSeconds},
  } = usePreferences();

  if (lastPassedStop && lastPassedStop.quay?.name) {
    return t(
      DepartureDetailsTexts.lastPassedStop(
        lastPassedStop.quay?.name,
        formatToClock(
          lastPassedStop?.actualDepartureTime,
          language,
          'nearest',
          debugShowSeconds,
        ),
      ),
    );
  }

  const firstStop = estimatedCallsWithMetadata[0];

  if (
    firstStop?.quay?.name &&
    firstStop.realtime &&
    !isInThePast(firstStop.expectedDepartureTime)
  ) {
    return t(
      DepartureDetailsTexts.noPassedStop(
        firstStop.quay.name,
        formatToClock(
          firstStop?.expectedDepartureTime,
          language,
          'floor',
          debugShowSeconds,
        ),
      ),
    );
  }
  const timeRepType = getTimeRepresentationType({
    missingRealTime: !firstStop.realtime,
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
