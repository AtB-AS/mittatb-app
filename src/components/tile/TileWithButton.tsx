import {NativeButton} from '@atb/components/native-button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export type TileWithButtonProps = {
  mode: 'compact' | 'spacious';
  interactiveColor: InteractiveColor;
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
  interactiveColor,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
  buttonText,
  buttonSvg,
  children,
}: TileWithButtonProps): React.JSX.Element {
  const styles = useStyles(interactiveColor);

  return (
    <NativeButton
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
          color={interactiveColor.default.foreground.primary}
        />
      </View>
    </NativeButton>
  );
}

const useStyles = (interactiveColor: InteractiveColor) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      backgroundColor: interactiveColor.default.background,
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
      borderWidth: theme.border.width.slim,
      borderColor: theme.color.background.neutral[2].background,
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
      borderColor: theme.color.background.neutral[2].background,
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
      color: interactiveColor.default.foreground.primary,
    },
  }))();
