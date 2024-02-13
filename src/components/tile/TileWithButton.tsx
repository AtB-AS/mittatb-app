import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor, getInteractiveColor} from '@atb/theme/colors';
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
  buttonSvg: (props: SvgProps) => JSX.Element;
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
}: TileWithButtonProps): JSX.Element {
  const styles = useStyles(interactiveColor);
  const {themeName} = useTheme();
  const color = getInteractiveColor(themeName, interactiveColor);

  return (
    <PressableOpacity
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
          type={mode === 'spacious' ? 'body__primary' : 'body__tertiary'}
        >
          {buttonText}
        </ThemeText>
        <ThemeIcon
          size={mode === 'spacious' ? 'normal' : 'xSmall'}
          svg={buttonSvg}
          fill={color.outline.text}
        />
      </View>
    </PressableOpacity>
  );
}

const useStyles = (interactiveColor: InteractiveColor) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      backgroundColor: theme.interactive[interactiveColor].default.background,
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
      borderWidth: theme.border.width.slim,
      borderColor: theme.static.background.background_2.background,
    },
    spaciousContentContainer: {
      padding: theme.spacings.xLarge,
      flexGrow: 1,
    },
    compactContentContainer: {
      padding: theme.spacings.medium,
      flexGrow: 1,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.interactive[interactiveColor].outline.background,
    },
    spaciousButton: {
      paddingHorizontal: theme.spacings.xLarge,
      paddingVertical: theme.spacings.medium,
    },
    compactButton: {
      paddingHorizontal: theme.spacings.medium,
      paddingVertical: theme.spacings.small,
    },
    buttonText: {
      color: theme.interactive[interactiveColor].outline.text,
    },
  }))();
