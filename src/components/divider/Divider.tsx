import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useTheme} from '@atb/theme';

export const Divider = ({style}: {style?: ViewStyle}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        {
          borderTopWidth: theme.border.width.slim,
          borderColor: theme.static.background.background_1.background,
        },
        style,
      ]}
    />
  );
};
