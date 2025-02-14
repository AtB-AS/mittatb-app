import React from 'react';
import {getSvgForMostCriticalSituationOrNotice} from './utils';
import {SituationType} from './types';
import {ThemeIcon} from '@atb/components/theme-icon';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  notices?: NoticeFragment[];
  cancellation?: boolean;
} & ({situations: SituationType[]} | {situation: SituationType});

export const SituationOrNoticeIcon = ({
  style,
  accessibilityLabel,
  notices,
  cancellation,
  ...props
}: Props) => {
  const situations =
    'situation' in props ? [props.situation] : props.situations;
  const {themeName} = useThemeContext();

  // TODO: It might be needed to check if the transport is flexible and shows a yellow icon (warning)
  const svg = getSvgForMostCriticalSituationOrNotice(
    situations,
    themeName,
    notices,
    cancellation,
  );
  if (!svg) return null;

  return (
    <ThemeIcon
      svg={svg}
      accessibilityLabel={accessibilityLabel}
      style={style}
    />
  );
};
