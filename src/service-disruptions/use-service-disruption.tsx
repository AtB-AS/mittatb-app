import React, {useCallback} from 'react';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import ServiceDisruptionSheet from './ServiceDisruptionSheet';
import {LeftButtonProps} from '@atb/components/screen-header';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export default function useServiceDisruptionModal(): {
  leftButton?: LeftButtonProps;
} {
  const {open: openBottomSheet} = useBottomSheet();
  const {service_disruption_url} = useRemoteConfig();
  const hasValidServiceDisruptionUrl = !!service_disruption_url;

  const openServiceDistruptionSheet = useCallback(() => {
    openBottomSheet((close, focusRef) => (
      <ServiceDisruptionSheet
        close={close}
        serviceDisruptionUrl={service_disruption_url}
        ref={focusRef}
      />
    ));
  }, []);

  const leftButton: LeftButtonProps = {
    type: 'status-disruption',
    // This should always be in header and thus background_accent_3
    // hardcoded from before, but we should at some point see how to better handle it.
    color: 'background_accent_3',
    onPress: openServiceDistruptionSheet,
    accessibilityLabel: '',
    testID: 'lhb',
  };

  return {
    leftButton: hasValidServiceDisruptionUrl ? leftButton : undefined,
  };
}
