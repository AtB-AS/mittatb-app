import {ArrowLeft} from '@atb/assets/svg/icons/navigation';
import insets from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps} from 'react-native';
import Button from '../button';
import shadows from './shadows';

const BackArrow: React.FC<{onBack(): void} & AccessibilityProps> = ({
  onBack,
}) => {
  return (
    <Button
      type="compact"
      mode="primary2"
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
      icon={ArrowLeft}
      style={shadows}
    ></Button>
  );
};

export default BackArrow;
