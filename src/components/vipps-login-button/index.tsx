import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import vippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';

const VIPPS_BACKGROUND_COLOR = '#FF5B24';
export const VippsLoginButton = ({
  onPress,
  disabled,
}: {
  onPress: () => {};
  disabled: boolean;
}) => {
  const {t} = useTranslation();
  const style = useStyle();

  return (
    <TouchableOpacity
      accessibilityLabel={t(LoginTexts.logInOptions.options.vipps.a11yLabel)}
      onPress={onPress}
    >
      <View style={[style.container, disabled && style.disabledOpacity]}>
        <ThemeText type="body__primary--bold" style={style.label}>
          {t(LoginTexts.logInOptions.options.vipps.label)}
        </ThemeText>
        <ThemeIcon svg={vippsLogo} style={style.icon} />
      </View>
    </TouchableOpacity>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: VIPPS_BACKGROUND_COLOR,
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
