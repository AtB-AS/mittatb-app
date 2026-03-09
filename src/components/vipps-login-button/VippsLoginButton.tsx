import {LoginTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ThemeText} from '@atb/components/text';
import {View, ViewStyle} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import VippsLogo from '@atb/assets/svg/color/icons/ticketing/VippsLogo';
import {NativeBlockButton} from '@atb/components/native-button';

const VIPPS_BACKGROUND_COLOR = '#FF5B24';
const VIPPS_TEXT_COLOR = '#FFFFFF';

export const VippsLoginButton = ({
  onPress,
  disabled,
  style,
}: {
  onPress: () => void;
  disabled: boolean;
  style?: ViewStyle;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <NativeBlockButton
      accessibilityLabel={t(LoginTexts.logInOptions.options.vipps.a11yLabel)}
      role="button"
      onPress={onPress}
    >
      <View
        style={[styles.container, disabled && styles.disabledOpacity, style]}
      >
        <ThemeText
          typography="body__m__strong"
          style={styles.label}
          color={VIPPS_TEXT_COLOR}
        >
          {t(LoginTexts.logInOptions.options.vipps.label)}
        </ThemeText>
        <VippsLogo style={styles.vippsLogo} />
      </View>
    </NativeBlockButton>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: VIPPS_BACKGROUND_COLOR,
    borderRadius: theme.border.radius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
    borderColor: VIPPS_BACKGROUND_COLOR,
  },
  disabledOpacity: {
    opacity: 0.2,
  },
  vippsLogo: {
    marginLeft: theme.spacing.small,
    marginTop: theme.spacing.xSmall,
    alignSelf: 'center',
  },
  label: {
    paddingVertical: theme.spacing.medium,
  },
}));
