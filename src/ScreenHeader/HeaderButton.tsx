import {AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import insets from '../utils/insets';

export type IconButton = {
  icon: React.ReactNode;
  onPress?(): void;
} & AccessibilityProps;
const HeaderButton: React.FC<IconButton> = ({icon, onPress, ...props}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={insets.all(12)}
      accessibilityRole="button"
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};
export default HeaderButton;
