import InAppReview from 'react-native-in-app-review';
import {useAnalyticsContext} from '@atb/analytics';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useCallback} from 'react';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {storage} from '@atb/storage';

const LAST_IN_APP_REVIEW_PROMPT_KEY = '@ATB_in_app_review_last_request';
const IN_APP_REVIEW_PRESENTED_KEY = '@ATB_in_app_review_presented';
const INTERVAL_BETWEEN_PROMPTS = 5 * 24 * 60 * 60 * 1000; // 5 days

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

    (async () => {
      try {
        const inAppReviewPresented = await storage.get(
          IN_APP_REVIEW_PRESENTED_KEY,
        );

        if (inAppReviewPresented === 'true') {
          return;
        }

        const lastPromptDateString = await storage.get(
          LAST_IN_APP_REVIEW_PROMPT_KEY,
        );

        if (lastPromptDateString) {
          const lastPromptDate = new Date(lastPromptDateString);
          const currentDate = new Date();

          const timeDifference =
            currentDate.getTime() - lastPromptDate.getTime();

          if (timeDifference <= INTERVAL_BETWEEN_PROMPTS) {
            return;
          }
        }

        // Store the date when there was an attempt to present the review,
        // independent of the result or response.
        await storage.set(
          LAST_IN_APP_REVIEW_PROMPT_KEY,
          new Date().toISOString(),
        );

        const hasFlowFinishedSuccessfully =
          await InAppReview.RequestInAppReview();
        if (hasFlowFinishedSuccessfully) {
          // Store that review was presented to avoid present it
          await storage.set(IN_APP_REVIEW_PRESENTED_KEY, 'true');

          // Android:
          // The review flow has completed.  The API does not indicate
          // whether the user left a review or dismissed the dialog.

          // iOS:
          // The review prompt was successfully triggered. The API does not provide
          // feedback on whether the user left a review or closed the prompt.
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
      } catch (error) {
        // Log and report any errors encountered during the in-app review request.
        // For detailed error codes, refer to:
        // https://github.com/MinaSamir11/react-native-in-app-review#errors-and-google-play-app-store-error-codes
        notifyBugsnag(error as any);
      }
    })();
  }, [isInAppReviewEnabled, analytics]);

  return {requestReview};
}
