import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {TravelAidTexts} from '@atb/translations/screens/subscreens/TravelAid';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {AUTHORITY} from '@env';
import {addMinutes, isBetween} from '@atb/utils/date';
import React from 'react';
import type {ServiceJourneyWithGuaranteedCalls} from '../types';
import {View} from 'react-native';
import {MessageInfoText} from '@atb/components/message-info-text';
import type {MutationStatus} from '@tanstack/react-query';
import type {SendStopSignalRequestType} from '@atb/api/stop-signal';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import type {StopSignalButtonConfigType} from '@atb-as/config-specs';
import {isApplicableTransportMode} from '../utils';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useAnalyticsContext} from '@atb/analytics';

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
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const styles = useStyles();
  const {stopSignalButtonConfig: config} = useFirestoreConfigurationContext();
  const analytics = useAnalyticsContext();

  if (!isTravelAidStopButtonEnabled) return null;

  const selectedCall =
    serviceJourney.estimatedCalls.find(
      (c) => c.stopPositionInPattern === fromStopPosition,
    ) || serviceJourney.estimatedCalls[0];

  const shouldShow = shouldShowStopButton(serviceJourney, selectedCall, config);
  if (!shouldShow) return null;

  const isDisabled =
    status !== 'success' && !isStopButtonEnabled(selectedCall, config);

  return (
    <View>
      {status === 'error' && (
        <MessageInfoBox
          type="error"
          message={t(dictionary.genericErrorMsg)}
          a11yLiveRegion="assertive"
          style={styles.requestError}
        />
      )}
      {status !== 'success' && (
        <Button
          expanded={true}
          interactiveColor={theme.color.interactive['0']}
          text={t(TravelAidTexts.stopButton.text)}
          onPress={() => {
            analytics.logEvent('Journey aid', 'Stop signal button pressed');
            onPress({
              serviceJourneyId: serviceJourney.id,
              quayId: selectedCall.quay.id,
              serviceDate: selectedCall.date,
            });
          }}
          loading={status === 'loading'}
          disabled={isDisabled}
        />
      )}
      {isDisabled && (
        <MessageInfoText
          type="warning"
          message={t(TravelAidTexts.stopButton.notAvailable)}
          style={styles.notAvailableWarning}
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

const isStopButtonEnabled = (
  call: EstimatedCallWithQuayFragment,
  config: StopSignalButtonConfigType,
) => {
  if (!call.realtime) return false;

  const activationWindowStart = addMinutes(
    call.expectedArrivalTime,
    -config.activationWindowStartMinutesBefore,
  );
  const activationWindowEnd = addMinutes(
    call.expectedArrivalTime,
    -config.activationWindowEndMinutesBefore,
  );
  return isBetween(new Date(), activationWindowStart, activationWindowEnd);
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  requestError: {marginBottom: theme.spacing.medium},
  notAvailableWarning: {marginTop: theme.spacing.small},
}));
