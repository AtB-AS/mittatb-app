import {Warning} from '@atb/assets/svg/color/situations';
import React, {ComponentProps} from 'react';
import {hasSituations} from './utils';
import {SituationsType} from '@atb/situations/types';

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

  return <Warning accessibilityLabel={accessibilityLabel} style={style} />;
};
