import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import vippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';

export const VippsLoginButton = ({
  onPress,
  disabled,
}: {
  onPress: () => {};
  disabled: boolean;
}) => {
  const {t} = useTranslation();
  const style = useStyle();
  const getVippsLabel = () => (
    <View style={[style.container, disabled && style.disabledOpacity]}>
      <ThemeText type="body__primary--bold" style={style.label}>
        {t(LoginTexts.logInOptions.options.vipps.label)}
      </ThemeText>
      <ThemeIcon svg={vippsLogo} style={style.icon} />
    </View>
  );

  return (
    <TouchableOpacity
      accessibilityLabel={t(LoginTexts.logInOptions.options.vipps.a11yLabel)}
      onPress={onPress}
    >
      {getVippsLabel()}
    </TouchableOpacity>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FF5B24',
    borderRadius: theme.border.radius.regular,
    justifyContent: 'center',
  },
  disabledOpacity: {
    opacity: 0.2,
  },
  icon: {
    minWidth: '15%',
    minHeight: '30%',
    alignSelf: 'center',
    marginTop: theme.spacings.xSmall,
  },
  label: {color: 'white', paddingVertical: theme.spacings.medium},
}));
