import {storage} from '@atb/modules/storage';

const STORAGE_KEY_IS_COMPLETED =
  '@ATB_smart_park_and_ride_onboarding_completed';

/**
 * Check if the Smart Park and Ride onboarding is completed without requiring
 * the React context. This is useful for initialization logic or non-React
 * contexts.
 */
export const getSmartParkAndRideOnboardingCompleted =
  async (): Promise<boolean> => {
    try {
      const isCompletedData = await storage.get(STORAGE_KEY_IS_COMPLETED);
      return isCompletedData ? JSON.parse(isCompletedData) : false;
    } catch (error) {
      console.error(
        'Failed to get smart park and ride onboarding completion status:',
        error,
      );
      return false;
    }
  };
