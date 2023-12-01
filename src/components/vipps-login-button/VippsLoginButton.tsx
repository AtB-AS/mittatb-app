import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {View, ViewStyle} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import vippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';
import {PressableOpacity} from '@atb/components/pressable-opacity';

const VIPPS_BACKGROUND_COLOR = '#FF5B24';
export const VippsLoginButton = ({
  onPress,
  disabled,
  containerStyle,
}: {
  onPress: () => {};
  disabled: boolean;
  containerStyle: ViewStyle;
}) => {
  const {t} = useTranslation();
  const styles = useStyle();

  return (
    <PressableOpacity
      accessibilityLabel={t(LoginTexts.logInOptions.options.vipps.a11yLabel)}
      onPress={onPress}
    >
      <View
        style={[
          styles.container,
          disabled && styles.disabledOpacity,
          containerStyle,
        ]}
      >
        <ThemeText type="body__primary--bold" style={styles.label}>
          {t(LoginTexts.logInOptions.options.vipps.label)}
        </ThemeText>
        <ThemeIcon svg={vippsLogo} size="large" style={styles.icon} />
      </View>
    </PressableOpacity>
  );
};

const vippsIconExtraScale = 0.9;
const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: VIPPS_BACKGROUND_COLOR,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'center',
  },
  disabledOpacity: {
    opacity: 0.2,
  },
  icon: {
    minHeight: '30%',
    marginLeft: theme.icon.size.large * (vippsIconExtraScale / 2),
    transform: [{scale: 1 + vippsIconExtraScale}],
    alignSelf: 'center',
    marginTop: theme.spacings.xSmall,
  },
  label: {color: 'white', paddingVertical: theme.spacings.medium},
}));
