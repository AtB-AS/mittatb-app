import {Warning} from '@atb/assets/svg/color/situations';
import React, {ComponentProps} from 'react';
import {filterSituations} from './utils';
import {SituationType} from '@atb/situations/types';

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

  return <Warning accessibilityLabel={accessibilityLabel} style={style} />;
};
