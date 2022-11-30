import {Warning} from '@atb/assets/svg/color/icons/status';
import React, {ComponentProps} from 'react';
import {getSvgForMostCriticalSituation} from './utils';
import {SituationType} from '@atb/situations/types';
import ThemeIcon from '@atb/components/theme-icon';

type Props = {
  style?: ComponentProps<typeof Warning>['style'];
  accessibilityLabel?: string;
} & ({situations: SituationType[]} | {situation: SituationType});

export const SituationIcon = ({style, accessibilityLabel, ...props}: Props) => {
  const situations =
    'situation' in props ? [props.situation] : props.situations;

  const svg = getSvgForMostCriticalSituation(situations);
  if (!svg) return null;

  return (
    <ThemeIcon
      svg={svg}
      accessibilityLabel={accessibilityLabel}
      style={style}
    />
  );
};
