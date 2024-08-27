import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';
import {useTheme} from '@atb/theme'

export const BackArrow: React.FC<{onBack(): void} & AccessibilityProps> = ({
  onBack,
}) => {
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[0]
  
  return (
    <Button
      type="medium"
      compact={true}
      interactiveColor={interactiveColor}
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
      leftIcon={{svg: ArrowLeft}}
      hasShadow={true}
    />
  );
};
