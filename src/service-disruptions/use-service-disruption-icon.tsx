import {IconButtonProps} from '@atb/components/screen-header';
import {ThemeIcon} from '@atb/components/theme-icon';
import React from 'react';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import ServiceDisruption from '@atb/assets/svg/mono-icons/status/ServiceDisruption';
import {
  GlobalMessageContextEnum,
  useGlobalMessagesState,
} from '@atb/global-messages';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {ServiceDisruptionSheet} from '@atb/service-disruptions/ServiceDisruptionSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {ContrastColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';

export const useServiceDisruptionIcon = (
  color?: ContrastColor,
  testID?: string,
): IconButtonProps | undefined => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {findGlobalMessages} = useGlobalMessagesState();
  const {open: openBottomSheet} = useBottomSheet();
  const now = useNow(2500);

  const globalMessages = findGlobalMessages(
    GlobalMessageContextEnum.appServiceDisruptions,
  ).filter((gm) => isWithinTimeRange(gm, now));

  const openServiceDisruptionSheet = () => {
    openBottomSheet(() => <ServiceDisruptionSheet />);
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
  };
};
