import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenFooterProps = {
  children: React.ReactNode;
};

export default function FullScreenFooter({children}: ScreenFooterProps) {
  const {bottom} = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <View
      style={{
        padding: theme.spacings.medium,
        paddingBottom: Math.max(bottom, theme.spacings.medium),
      }}
    >
      {children}
    </View>
  );
}
