import {Location} from '@atb/assets/svg/mono-icons/places';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';
import {ShadowWrapper} from '@atb/components/map';

export const PositionArrow: React.FC<
  {onPress(): void} & AccessibilityProps
> = ({onPress}) => {
  return (
    <ShadowWrapper>
      <Button
        type="medium"
        compact={true}
        interactiveColor="interactive_2"
        onPress={onPress}
        hitSlop={insets.symmetric(12, 20)}
        leftIcon={{svg: Location}}
      />
    </ShadowWrapper>
  );
};
