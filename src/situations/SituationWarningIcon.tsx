import {Warning} from '@atb/assets/svg/color/situations';
import React, {ComponentProps} from 'react';
import {hasSituations} from './utils';
import {Situation as Situation_v1} from '@atb/sdk';
import {Situation as Situation_from_Trips} from '@atb/api/types/trips';

type Props = {
  situations: Situation_v1[] | Situation_from_Trips[];
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
