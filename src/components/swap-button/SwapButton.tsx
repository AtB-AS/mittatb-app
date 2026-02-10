import React from 'react';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import type {ButtonProps} from '@atb/components/button';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

export function SwapButton(props: ButtonProps) {
  const {t} = useTranslation();
  return (
    <PressableOpacity
      style={props.style}
      {...props}
      accessibilityLabel={
        t(TripSearchTexts.location.swapButton.a11yLabel) + screenReaderPause
      }
    >
      <ThemeIcon svg={Swap} size="normal" />
    </PressableOpacity>
  );
}
