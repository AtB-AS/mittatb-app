import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const Consequence = ({value, icon}: {value: string; icon: JSX.Element}) => {
  const styles = useStyle();
  return (
    <View style={styles.consequence}>
      <View style={styles.icon}>{icon}</View>
      <ThemeText style={styles.description} color={themeColor}>
        {value}
      </ThemeText>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  description: {
    paddingHorizontal: theme.spacings.medium,
    flex: 1,
  },
  icon: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacings.medium,
  },
  consequence: {
    backgroundColor: theme.static.background.background_accent_1.background,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacings.medium,
    flexDirection: 'row',
    padding: theme.spacings.medium,
  },
}));
export default Consequence;
