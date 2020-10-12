import {AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import insets from '../utils/insets';

export type IconButton = {
  icon: React.ReactNode;
  onPress?(): void;
} & AccessibilityProps;
const HeaderButton: React.FC<{iconButton: IconButton}> = ({iconButton}) => {
  return (
    <TouchableOpacity
      onPress={iconButton.onPress}
      hitSlop={insets.all(12)}
      accessibilityLabel={iconButton.accessibilityLabel}
      accessibilityRole="button"
    >
      {iconButton.icon}
    </TouchableOpacity>
  );
};
export default HeaderButton;
