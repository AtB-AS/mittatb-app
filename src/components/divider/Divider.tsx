import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';

export const Divider = ({style}: {style?: ViewStyle}) => {
  const {theme} = useThemeContext();

  return (
    <View
      style={[
        {
          borderTopWidth: theme.border.width.slim,
          borderColor: theme.color.background.neutral[1].background,
        },
        style,
      ]}
    />
  );
};
