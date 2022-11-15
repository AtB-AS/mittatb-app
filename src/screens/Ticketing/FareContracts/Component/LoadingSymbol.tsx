import {StyleSheet, useTheme} from '@atb/theme';
import {flatStaticColors, StaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import React from 'react';

const LoadingSymbol = () => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const themeColor: StaticColor = 'background_1';

  return (
    <View
      style={[
        styles.symbolContainer,
        {
          backgroundColor: themeColor
            ? flatStaticColors[themeName][themeColor].background
            : undefined,
        },
      ]}
    />
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  symbolContainer: {
    height: 72,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 1000,
  },
}));

export default LoadingSymbol;
