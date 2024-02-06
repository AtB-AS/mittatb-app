import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';

export const BackArrow: React.FC<{onBack(): void} & AccessibilityProps> = ({
  onBack,
}) => {
  return (
    <Button
      type="medium"
      compact={true}
      interactiveColor="interactive_0"
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
      leftIcon={{svg: ArrowLeft}}
      hasShadow={true}
    />
  );
};
