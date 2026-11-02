import {NativeTouchable} from '@atb/components/native-touchable';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export type TileWithButtonProps = {
  mode: 'compact' | 'spacious';
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  buttonText: string;
  buttonSvg: (props: SvgProps) => React.JSX.Element;
  children?: React.ReactNode;
};

export function TileWithButton({
  mode,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
  buttonText,
  buttonSvg,
  children,
}: TileWithButtonProps): React.JSX.Element {
  const styles = useStyles();
  const {theme} = useThemeContext();

  return (
    <NativeTouchable
      variant="block"
      style={[styles.container, style]}
      accessible={true}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      testID={testID}
    >
      <View
        style={
          mode === 'spacious'
            ? styles.spaciousContentContainer
            : styles.compactContentContainer
        }
        importantForAccessibility="no-hide-descendants"
      >
        {children}
      </View>
      <View
        style={[
          styles.button,
          mode === 'spacious' ? styles.spaciousButton : styles.compactButton,
        ]}
        testID={testID + 'Button'}
      >
        <ThemeText
          style={styles.buttonText}
          typography={mode === 'spacious' ? 'body__m' : 'body__xs'}
        >
          {buttonText}
        </ThemeText>
        <ThemeIcon
          size={mode === 'spacious' ? 'normal' : 'xSmall'}
          svg={buttonSvg}
          color={theme.color.surface.neutral.strong.foreground.primary}
        />
      </View>
    </NativeTouchable>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.surface.neutral.strong.background,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.surface.neutral.subtle.background,
  },
  spaciousContentContainer: {
    padding: theme.spacing.medium,
    flexGrow: 1,
  },
  compactContentContainer: {
    padding: theme.spacing.medium,
    flexGrow: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: theme.border.width.slim,
    borderColor: theme.color.surface.neutral.subtle.background,
  },
  spaciousButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
  compactButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  buttonText: {
    color: theme.color.surface.neutral.strong.foreground.primary,
  },
}));
