import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {TravelAidTexts} from '@atb/translations';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {AUTHORITY} from '@env';
import {secondsToMinutesLong} from '@atb/utils/date';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {useNow} from '@atb/utils/use-now';
import React from 'react';
import type {ServiceJourneyWithGuaranteedCalls} from '../types';
import {View} from 'react-native';
import type {MutationStatus} from '@tanstack/react-query';
import type {SendStopSignalRequestType} from '@atb/api/stop-signal';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import type {StopSignalButtonConfigType} from '@atb-as/config-specs';
import {
  getStopButtonAvailability,
  isApplicableTransportMode,
  type StopButtonAvailability,
} from '../utils';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useAnalyticsContext} from '@atb/modules/analytics';

export const StopSignalButton = ({
  serviceJourney,
  fromStopPosition,
  onPress,
  status,
}: {
  serviceJourney: ServiceJourneyWithGuaranteedCalls;
  fromStopPosition: number;
  onPress: (args: SendStopSignalRequestType) => void;
  status: MutationStatus;
}) => {
  const {isTravelAidStopButtonEnabled} = useFeatureTogglesContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const {stopSignalButtonConfig: config} = useFirestoreConfigurationContext();
  const analytics = useAnalyticsContext();
  // Re-evaluate the activation window even when the polled data is unchanged
  const now = useNow(10 * ONE_SECOND_MS);

  if (!isTravelAidStopButtonEnabled) return null;

  const selectedCall =
    serviceJourney.estimatedCalls.find(
      (c) => c.stopPositionInPattern === fromStopPosition,
    ) || serviceJourney.estimatedCalls[0];

  const shouldShow = shouldShowStopButton(serviceJourney, selectedCall, config);
  if (!shouldShow) return null;

  const availability = getStopButtonAvailability(
    selectedCall,
    config,
    new Date(now),
  );

  const showButton = availability === 'available' || status === 'pending';

  return (
    <View>
      {status === 'error' && (
        <MessageInfoBox
          type="error"
          message={t(TravelAidTexts.stopButton.errorMessage)}
          a11yLiveRegion="assertive"
          style={styles.requestError}
        />
      )}
      {status !== 'success' && showButton && (
        <Button
          surfaceColor="accent"
          expanded={true}
          text={t(TravelAidTexts.stopButton.text)}
          onPress={() => {
            analytics.logEvent('Journey aid', 'Stop signal button pressed');
            onPress({
              quayId: selectedCall.quay.id,
              serviceJourneyId: serviceJourney.id,
              serviceJourneyDate: selectedCall.date,
            });
          }}
          loading={status === 'pending'}
        />
      )}
      {status !== 'success' && !showButton && (
        <StopButtonUnavailableInfo
          availability={availability}
          config={config}
        />
      )}
      {status === 'success' && (
        <MessageInfoBox
          type="valid"
          message={t(TravelAidTexts.stopButton.successMessage)}
          a11yLiveRegion="assertive"
        />
      )}
    </View>
  );
};

const shouldShowStopButton = (
  serviceJourney: ServiceJourneyWithGuaranteedCalls,
  call: EstimatedCallWithQuayFragment,
  config: StopSignalButtonConfigType,
) => {
  return (
    !call.actualDepartureTime &&
    isApplicableTransportMode(config.modes, serviceJourney) &&
    AUTHORITY === serviceJourney.line.authority?.id
  );
};

const StopButtonUnavailableInfo = ({
  availability,
  config,
}: {
  availability: Exclude<StopButtonAvailability, 'available'>;
  config: StopSignalButtonConfigType;
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  let content = {
    title: '',
    message: '',
  };

  switch (availability) {
    case 'noRealtime':
      content = {
        title: t(TravelAidTexts.stopButton.unavailable.title),
        message: t(TravelAidTexts.stopButton.notAvailable),
      };
      break;
    case 'tooEarly':
      content = {
        title: t(TravelAidTexts.stopButton.unavailable.title),
        message: t(
          TravelAidTexts.stopButton.unavailable.tooEarly(
            secondsToMinutesLong(
              config.activationWindowStartMinutesBefore * 60,
              language,
            ),
          ),
        ),
      };
      break;
    case 'tooLate':
      content = {
        title: t(TravelAidTexts.stopButton.unavailable.title),
        message: t(
          TravelAidTexts.stopButton.unavailable.tooLate(
            secondsToMinutesLong(
              config.activationWindowEndMinutesBefore * 60,
              language,
            ),
          ),
        ),
      };
      break;
    default:
      return null;
  }

  return (
    <MessageInfoBox
      type="warning"
      title={content.title}
      message={content.message}
      style={styles.notAvailableWarning}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  requestError: {marginBottom: theme.spacing.medium},
  notAvailableWarning: {marginTop: theme.spacing.small},
}));
