import {useMutation} from '@tanstack/react-query';
import {saveJourney} from '@atb/api/journey';
import {TripPattern} from '@atb/api/types/trips';
import {NativeLiveActivities} from '@atb/modules/native';
import type {TransitLiveActivityContentState} from './types';

type StartTripLiveActivityRequest = {
  tripPattern: TripPattern;
  contentState: TransitLiveActivityContentState;
};

/**
 * Start a Live Activity for a trip: save the trip so the backend has something
 * to push updates about, then hand its id to ActivityKit as the activity's
 * attributes.
 *
 * Registering the activity for push is not done here — it happens once
 * ActivityKit issues a push token, which
 * {@link useLiveActivityRegistration} picks up. The trip has to be saved first
 * either way, as the backend rejects a registration for a trip it does not have.
 */
export const useStartTripLiveActivity = () =>
  useMutation({
    mutationFn: async ({
      tripPattern,
      contentState,
    }: StartTripLiveActivityRequest) => {
      if (!NativeLiveActivities) {
        throw new Error('Live Activities are not available on this device.');
      }

      const {data} = await saveJourney({tripPattern});
      const activityId = await NativeLiveActivities.startActivity(
        JSON.stringify({tripId: data.tripId}),
        JSON.stringify(contentState),
      );

      return {activityId, tripId: data.tripId};
    },
  });
