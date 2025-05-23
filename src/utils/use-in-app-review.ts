import InAppReview from 'react-native-in-app-review';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useCallback} from 'react';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {storage} from '@atb/modules/storage';

const LAST_IN_APP_REVIEW_PROMPT_KEY = '@ATB_in_app_review_last_request';
const IN_APP_REVIEW_PRESENTED_KEY = '@ATB_in_app_review_presented';
const INTERVAL_BETWEEN_PROMPTS = 5 * 24 * 60 * 60 * 1000; // 5 days

export enum InAppReviewContext {
  DepartureDetails = 'Departure details: Bus in map dismissed',
  TripDetails = 'Trip details: Bus in map dismissed',
  Announcement = 'Announcements: Bottom sheet dismissed',
}

export function useInAppReviewFlow() {
  const analytics = useAnalyticsContext();
  const {isInAppReviewEnabled, isInAppReviewForAnnouncementsEnabled} =
    useFeatureTogglesContext();

  const requestReview = useCallback(
    (context: InAppReviewContext) => {
      switch (context) {
        case InAppReviewContext.Announcement:
          if (!isInAppReviewForAnnouncementsEnabled) {
            return;
          }
          break;
        default:
          if (!isInAppReviewEnabled) {
            return;
          }
          break;
      }

      // Check if in-app review functionality is available on this device.
      if (!InAppReview.isAvailable()) {
        analytics.logEvent(
          'In App Review',
          'In-app review is not supported on this device. Context: ' + context,
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
              'In-app review prompt successfully launched in context: ' +
                context,
            );
          } else {
            analytics.logEvent(
              'In App Review',
              'Failed to present the in-app review prompt in context: ' +
                context,
            );
          }
        } catch (error) {
          // Log and report any errors encountered during the in-app review request.
          // For detailed error codes, refer to:
          // https://github.com/MinaSamir11/react-native-in-app-review#errors-and-google-play-app-store-error-codes
          notifyBugsnag(error as Error, {metadata: {context}});
        }
      })();
    },
    [isInAppReviewForAnnouncementsEnabled, isInAppReviewEnabled, analytics],
  );

  return {requestReview};
}
