import InAppReview from 'react-native-in-app-review';
import {useAnalyticsContext} from '@atb/analytics';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {useCallback} from 'react';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export function useInAppReviewFlow() {
  const analytics = useAnalyticsContext();
  const {isInAppReviewEnabled} = useFeatureTogglesContext();

  const requestReview = useCallback(() => {
    if (!isInAppReviewEnabled) {
      return;
    }

    // Check if in-app review functionality is available on this device.
    if (!InAppReview.isAvailable()) {
      analytics.logEvent(
        'In App Review',
        'Device does not support in-app review',
      );
      return;
    }

    InAppReview.RequestInAppReview()
      .then((hasFlowFinishedSuccessfully) => {
        // Android:
        // The review flow has completed.  The API does not indicate
        // whether the user left a review or dismissed the dialog.

        // iOS:
        // The review prompt was successfully triggered. The API does not provide
        // feedback on whether the user left a review or closed the prompt.
        if (hasFlowFinishedSuccessfully) {
          analytics.logEvent(
            'In App Review',
            'Review prompt launched successfully',
          );
        } else {
          analytics.logEvent(
            'In App Review',
            'In-app review failed to be presented',
          );
        }
      })
      .catch((error) => {
        // Log and report any errors encountered during the in-app review request.
        // For detailed error codes, refer to:
        // https://github.com/MinaSamir11/react-native-in-app-review#errors-and-google-play-app-store-error-codes
        notifyBugsnag(error as any);
      });
  }, [isInAppReviewEnabled, analytics]);

  return {requestReview};
}
