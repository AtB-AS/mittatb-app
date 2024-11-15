import {useFeatureToggles} from '@atb/feature-toggles';
import {StyleSheet, useTheme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {TravelAidTexts} from '@atb/translations/screens/subscreens/TravelAid';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import {AUTHORITY} from '@env';
import {addMinutes, isBetween} from '@atb/utils/date';
import React from 'react';
import type {ServiceJourneyWithGuaranteedCalls} from '@atb/travel-aid/types';
import {View} from 'react-native';
import {MessageInfoText} from '@atb/components/message-info-text';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import type {MutationStatus} from '@tanstack/react-query';
import type {SendStopSignalRequestType} from '@atb/api/stop-signal';
import {useFirestoreConfiguration} from '@atb/configuration';
import type {StopSignalButtonConfigType} from '@atb-as/config-specs';
import {isApplicableTransportMode} from '@atb/travel-aid/utils';
import {MessageInfoBox} from '@atb/components/message-info-box';

export const StopSignalButton = ({
  serviceJourney,
  fromQuayId,
  onPress,
  status,
}: {
  serviceJourney: ServiceJourneyWithGuaranteedCalls;
  fromQuayId?: string;
  onPress: (args: SendStopSignalRequestType) => void;
  status: MutationStatus;
}) => {
  const {isTravelAidStopButtonEnabled} = useFeatureToggles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const styles = useStyles();
  const {stopSignalButtonConfig: config} = useFirestoreConfiguration();

  if (!isTravelAidStopButtonEnabled) return null;

  const selectedCall = serviceJourney.estimatedCalls.reduce((selected, cur) =>
    cur.quay.id === fromQuayId ? cur : selected,
  );

  const shouldShow = shouldShowStopButton(serviceJourney, selectedCall, config);
  if (!shouldShow) return null;

  const isDisabled =
    status !== 'success' && !isStopButtonEnabled(selectedCall, config);

  return (
    <View>
      {status === 'error' && (
        <MessageInfoBox
          type="error"
          message={t(dictionary.standardErrorMsg)}
          style={styles.requestError}
        />
      )}
      <Button
        interactiveColor={theme.color.interactive['0']}
        text={t(
          status === 'success'
            ? TravelAidTexts.stopButton.textAfterSubmit
            : TravelAidTexts.stopButton.text,
        )}
        onPress={() => {
          if (status !== 'success') {
            onPress({
              serviceJourneyId: serviceJourney.id,
              quayId: selectedCall.quay.id,
              serviceDate: selectedCall.date,
            });
          }
        }}
        loading={status === 'loading'}
        active={status === 'success'}
        disabled={isDisabled}
        rightIcon={status === 'success' ? {svg: Confirm} : undefined}
      />
      {isDisabled && (
        <MessageInfoText
          type="warning"
          message={t(TravelAidTexts.stopButton.notAvailable)}
          style={styles.notAvailableWarning}
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
