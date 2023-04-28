import {View} from 'react-native';
import React from 'react';
import {useTheme} from '@atb/theme';

export const Divider = () => {
  const {theme} = useTheme();

  return (
    <View
      style={{
        marginVertical: theme.spacings.medium,
        borderTopWidth: theme.border.width.slim,
        borderColor: theme.static.background.background_1.background,
      }}
    />
  );
};
