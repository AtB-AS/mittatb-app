import React from 'react';
import Bugsnag from '@bugsnag/react-native';
import {Button} from '@atb/components/button';
import {TripPattern} from '@atb/api/types/trips';
import {LiveActivityTexts, useTranslation} from '@atb/translations';
import {useLiveActivitiesContext} from './LiveActivitiesContext';
import {useStartTripLiveActivity} from './use-start-trip-live-activity';
import {toInitialContentState} from './utils';

type Props = {
  tripPattern: TripPattern;
};

/**
 * Starts a Live Activity for this trip. Hidden where Live Activities cannot run,
 * and for trips with nothing to follow (no transit leg).
 */
export const StartLiveActivityButtonComponent = ({tripPattern}: Props) => {
  const {t} = useTranslation();
  const {isAvailable} = useLiveActivitiesContext();
  const {mutate: startLiveActivity, isPending} = useStartTripLiveActivity();

  const contentState = toInitialContentState(t, tripPattern);
  if (!isAvailable || !contentState) return null;

  return (
    <Button
      expanded={true}
      text={t(LiveActivityTexts.startButton)}
      loading={isPending}
      onPress={() =>
        startLiveActivity(
          {tripPattern, contentState},
          {
            onError: (error) =>
              Bugsnag.notify(`Failed to start Live Activity: ${error}`),
          },
        )
      }
    />
  );
};
