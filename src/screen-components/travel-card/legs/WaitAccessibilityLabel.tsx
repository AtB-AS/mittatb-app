import {Leg} from '@atb/api/types/trips';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {secondsBetween, secondsToDuration} from '@atb/utils/date';
import {significantWaitTime} from '@atb/screen-components/travel-details-screens';
import {HiddenAccessibilityLabel} from '../HiddenAccessibilityLabel';

export const WaitAccessibilityLabel = ({
  currentLeg,
  nextLeg,
}: {
  currentLeg: Leg;
  nextLeg?: Leg;
}) => {
  const {t, language} = useTranslation();

  if (!nextLeg) {
    return null;
  }

  const waitTimeInSeconds = secondsBetween(
    currentLeg.expectedEndTime,
    nextLeg.expectedStartTime,
  );
  const waitDuration = secondsToDuration(waitTimeInSeconds, language);
  const mustWait = significantWaitTime(waitTimeInSeconds);

  if (!mustWait) {
    return null;
  }

  return (
    <HiddenAccessibilityLabel
      accessibilityLabel={t(TravelCardTexts.legs.wait.a11yLabel(waitDuration))}
    />
  );
};
