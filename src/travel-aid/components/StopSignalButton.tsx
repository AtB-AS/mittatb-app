import {useFeatureToggles} from '@atb/feature-toggles';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
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

  if (!isTravelAidStopButtonEnabled) return null;

  const selectedCall = serviceJourney.estimatedCalls.reduce((selected, cur) =>
    cur.quay.id === fromQuayId ? cur : selected,
  );

  const shouldShow = shouldShowStopButton(serviceJourney, selectedCall);
  if (!shouldShow) return null;

  const isDisabled = status !== 'success' && !isStopButtonEnabled(selectedCall);

  return (
    <View>
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
              date: selectedCall.date,
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
) => {
  return (
    !call.actualDepartureTime &&
    serviceJourney.transportMode &&
    ['bus', 'tram'].includes(serviceJourney.transportMode) &&
    AUTHORITY === serviceJourney.line.authority?.id
  );
};

const isStopButtonEnabled = (call: EstimatedCallWithQuayFragment) => {
  if (!call.realtime) return false;

  const activationWindowStart = addMinutes(call.expectedArrivalTime, -60);
  const activationWindowEnd = addMinutes(call.expectedArrivalTime, -2);
  return isBetween(new Date(), activationWindowStart, activationWindowEnd);
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  notAvailableWarning: {marginTop: theme.spacing.small},
}));
