import InAppReview from 'react-native-in-app-review';
import {useAnalyticsContext} from '@atb/analytics';
import Bugsnag from '@bugsnag/react-native';
import {Platform} from 'react-native';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

export function useInAppReviewFlow() {
  const analytics = useAnalyticsContext();
  const {isInAppReviewEnabled} = useFeatureTogglesContext();

  const requestReview = async () => {
    if (!isInAppReviewEnabled) {
      return;
    }

    // Changed to an async function
    // Check if in-app review functionality is available on this device.
    if (!InAppReview.isAvailable()) {
      analytics.logEvent(
        'InAppReview',
        'Device does not support in-app review',
      );
      return;
    }

    try {
      const hasFlowFinishedSuccessfully =
        await InAppReview.RequestInAppReview();

      // Android:
      // The review flow has completed.  The API does not indicate
      // whether the user left a review or dismissed the dialog.

      // iOS:
      // The review prompt was successfully triggered. The API does not provide
      // feedback on whether the user left a review or closed the prompt.
      if (hasFlowFinishedSuccessfully) {
        analytics.logEvent(
          'InAppReview',
          Platform.OS === 'android'
            ? 'User completed or dismissed the review flow'
            : 'Review prompt launched successfully', // Simplified the logic using a ternary operator
        );
      } else {
        analytics.logEvent(
          'InAppReview',
          'In-app review failed to be presented',
        );
      }
    } catch (error) {
      // Log and report any errors encountered during the in-app review request.
      // For detailed error codes, refer to:
      // https://github.com/MinaSamir11/react-native-in-app-review#errors-and-google-play-app-store-error-codes
      Bugsnag.notify(error as any);
    }
  };

  return {requestReview};
}
