import React from 'react';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import type {ButtonProps} from '@atb/components/button';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export function SwapButton(props: ButtonProps) {
  return (
    <PressableOpacity {...props}>
      <Swap />
    </PressableOpacity>
  );
}
