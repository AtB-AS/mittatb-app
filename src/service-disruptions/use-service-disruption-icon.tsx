import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import React, {RefObject, useRef} from 'react';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import ServiceDisruption from '@atb/assets/svg/mono-icons/status/ServiceDisruption';
import {
  GlobalMessageContextEnum,
  useGlobalMessagesContext,
} from '@atb/modules/global-messages';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {ServiceDisruptionSheet} from '@atb/service-disruptions/ServiceDisruptionSheet';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {ContrastColor} from '@atb/theme/colors';
import {useThemeContext} from '@atb/theme';

export const useServiceDisruptionIcon = (
  color?: ContrastColor,
  testID?: string,
): IconButtonProps | undefined => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {findGlobalMessages} = useGlobalMessagesContext();
  const {open: openBottomSheet} = useBottomSheetContext();
  const now = useNow(2500);
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const globalMessages = findGlobalMessages(
    GlobalMessageContextEnum.appServiceDisruptions,
  ).filter((gm) => isWithinTimeRange(gm, now));

  const openServiceDisruptionSheet = () => {
    openBottomSheet(() => <ServiceDisruptionSheet />, onCloseFocusRef);
  };

  return {
    children: (
      <ThemeIcon
        testID={testID}
        color={color}
        svg={ServiceDisruption}
        notification={
          globalMessages.length > 0
            ? {
                color: theme.color.status.valid.primary,
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
    focusRef: onCloseFocusRef,
  };
};
