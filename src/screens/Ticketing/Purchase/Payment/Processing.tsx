import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import ThemeText from '../../../../components/text';
import {StyleSheet, useTheme} from '../../../../theme';

const Processing: React.FC<{message: string}> = ({message}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={theme.text.colors.primary}
        style={styles.indicator}
      />
      <ThemeText>{message}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level0,
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.large,
    borderRadius: theme.border.radius.regular,
    margin: theme.spacings.xLarge,
    alignItems: 'center',
  },
  indicator: {
    margin: theme.spacings.small,
  },
}));

export default Processing;
