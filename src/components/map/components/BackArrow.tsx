import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Button} from '@atb/components/button';
import {useThemeContext} from '@atb/theme';

export const BackArrow: React.FC<{onBack(): void} & AccessibilityProps> = ({
  onBack,
}) => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];

  return (
    <Button
      expanded={false}
      compact={true}
      interactiveColor={interactiveColor}
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
      leftIcon={{svg: ArrowLeft}}
      hasShadow={true}
    />
  );
};
