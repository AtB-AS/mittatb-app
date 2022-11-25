import {Warning} from '@atb/assets/svg/color/icons/status';
import React, {ComponentProps} from 'react';
import {filterSituations} from './utils';
import {SituationType} from '@atb/situations/types';
import ThemeIcon from '@atb/components/theme-icon';

type Props = {
  situations?: SituationType[];
  style?: ComponentProps<typeof Warning>['style'];
  accessibilityLabel?: string;
};

export const SituationWarningIcon = ({
  situations,
  style,
  accessibilityLabel,
}: Props) => {
  if (!filterSituations(situations)?.length) {
    return null;
  }

  return (
    <ThemeIcon
      svg={Warning}
      accessibilityLabel={accessibilityLabel}
      style={style}
    />
  );
};
