import {View} from 'react-native';
import ThemeIcon from '@atb/components/theme-icon';
import {Warning} from '@atb/assets/svg/color/situations';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';

const WarningMessage = ({message}: {message: string}) => {
  const style = useStyles();
  return (
    <View style={style.warning}>
      <ThemeIcon svg={Warning} style={style.warningIcon} />
      <ThemeText type="body__secondary">{message}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warning: {
    flexDirection: 'row',
    paddingTop: theme.spacings.small,
  },
  warningIcon: {
    marginRight: theme.spacings.xSmall,
  },
}));

export default WarningMessage;
