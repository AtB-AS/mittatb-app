import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import vipps from '@atb/assets/svg/mono-icons/ticketing/Vipps';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {TouchableOpacity, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';

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
      <ThemeText type="body__primary--bold" style={{color: 'white'}}>
        {t(LoginTexts.logInOptions.options.vipps.labelPart1)}
      </ThemeText>
      <ThemeText type="body__primary--bold" style={{color: 'white'}}>
        V
      </ThemeText>
      <ThemeIcon svg={vipps} colorType="background_accent_3" />
      <ThemeText type="body__primary--bold" style={{color: 'white'}}>
        {t(LoginTexts.logInOptions.options.vipps.labelPart2)}
      </ThemeText>
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
    paddingVertical: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    width: '100%',
    justifyContent: 'center',
  },
  disabledOpacity: {
    opacity: 0.2,
  },
}));
