import React from 'react';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import insets from '../../utils/insets';
import Button from '../button';
import shadows from './shadows';
import {AccessibilityProps} from 'react-native';

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
