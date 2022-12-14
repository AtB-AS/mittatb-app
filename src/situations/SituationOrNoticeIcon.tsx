import React from 'react';
import {getSvgForMostCriticalSituationOrNotice} from './utils';
import {SituationType} from './types';
import ThemeIcon from '@atb/components/theme-icon';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {StyleProp, ViewStyle} from 'react-native';

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

  const svg = getSvgForMostCriticalSituationOrNotice(
    situations,
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
