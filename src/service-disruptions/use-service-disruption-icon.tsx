import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import React from 'react';
import {StaticColor, TextColor} from '@atb/theme/colors';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import ServiceDisruption from '@atb/assets/svg/mono-icons/status/ServiceDisruption';
import {useGlobalMessagesState} from '@atb/global-messages';
import {isWithinTimeRange} from '@atb/global-messages/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {ServiceDisruptionSheet} from '@atb/service-disruptions/ServiceDisruptionSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const useServiceDisruptionIcon = (
  color?: StaticColor | TextColor,
  testID?: string,
): IconButtonProps | undefined => {
  const {t} = useTranslation();
  const {findGlobalMessages} = useGlobalMessagesState();
  const {open: openBottomSheet} = useBottomSheet();
  const {service_disruption_url} = useRemoteConfig();
  const hasValidServiceDisruptionUrl = !!service_disruption_url;
  const now = useNow(2500);

  if (!hasValidServiceDisruptionUrl) return undefined;

  const globalMessages = findGlobalMessages()
    .filter((a) => a.context.some((cont) => cont.includes('app')))
    .filter((gm) => isWithinTimeRange(gm, now));

  const openServiceDisruptionSheet = () => {
    openBottomSheet((close, focusRef) => (
      <ServiceDisruptionSheet
        close={close}
        serviceDisruptionUrl={service_disruption_url}
        ref={focusRef}
      />
    ));
  };

  return {
    children: (
      <ThemeIcon
        testID={testID}
        colorType={color}
        svg={ServiceDisruption}
        notification={
          globalMessages.length > 0
            ? {
                color: 'valid',
              }
            : undefined
        }
      />
    ),
    onPress: openServiceDisruptionSheet,
    testID: 'serviceDisruptionButton',
    accessibilityHint: t(
      ScreenHeaderTexts.headerButton['status-disruption'].a11yHint,
    ),
  };
};
