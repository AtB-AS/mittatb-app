import {Warning} from '@atb/assets/svg/color/icons/status';
import React, {ComponentProps} from 'react';
import {hasSituations} from './utils';
import {SituationsType} from '@atb/situations/types';
import ThemeIcon from '@atb/components/theme-icon';

type Props = {
  situations?: SituationsType;
  style?: ComponentProps<typeof Warning>['style'];
  accessibilityLabel?: string;
};

export const SituationWarningIcon = ({
  situations,
  style,
  accessibilityLabel,
}: Props) => {
  if (!hasSituations(situations)) {
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
