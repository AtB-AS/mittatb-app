import {Info, Warning} from '@atb/assets/svg/color/icons/status';
import React, {ComponentProps} from 'react';
import {getSvgForMostCriticalSituationOrNotice} from './utils';
import {SituationType} from '@atb/situations/types';
import ThemeIcon from '@atb/components/theme-icon';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';

type Props = {
  style?: ComponentProps<typeof Warning>['style'];
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
