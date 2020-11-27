import React from 'react';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import Button from '../button';
import shadows from './shadows';

const BackArrow: React.FC<{onBack(): void}> = ({onBack}) => {
  return (
    <Button
      type="compact"
      mode="primary2"
      accessibilityLabel="Gå tilbake"
      accessibilityRole="button"
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
      icon={ArrowLeft}
      style={shadows}
    ></Button>
  );
};

export default BackArrow;
