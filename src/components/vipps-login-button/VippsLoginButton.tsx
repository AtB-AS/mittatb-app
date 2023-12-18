import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {View, ViewStyle} from 'react-native';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import VippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';
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
  const {theme} = useTheme();

  const styles = useStyles();

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
        <ThemeText
          type="body__primary--bold"
          style={styles.label}
          color={theme.interactive.interactive_0.default}
        >
          {t(LoginTexts.logInOptions.options.vipps.label)}
        </ThemeText>
        <VippsLogo style={styles.vippsLogo} />
      </View>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
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
  vippsLogo: {
    marginLeft: theme.spacings.small,
    marginTop: theme.spacings.xSmall,
    alignSelf: 'center',
  },
  label: {
    paddingVertical: theme.spacings.medium,
  },
}));
