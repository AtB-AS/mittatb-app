import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor, getInteractiveColor} from '@atb/theme/colors';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

type TileWithButtonProps = {
  mode: 'compact' | 'spacious';
  interactiveColor: InteractiveColor;
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  style?: ViewStyle;
  testID?: string;
  buttonText: string;
  buttonSvg: (props: SvgProps) => JSX.Element;
  children?: React.ReactNode;
};

export function TileWithButton({
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
      testID={testID}
    >
      <View
        // style={[styles.upperPart, {minWidth: width * 0.6}]}
        style={styles.contentContainer}
        importantForAccessibility="no-hide-descendants"
      >
        {children}
      </View>
      <View style={styles.button} testID={testID + 'BuyButton'}>
        <ThemeText style={styles.buttonText}>{buttonText}</ThemeText>
        <ThemeIcon svg={buttonSvg} fill={color.outline.text} />
      </View>
    </PressableOpacity>
  );
}

const useStyles = (interactiveColor: InteractiveColor) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      marginHorizontal: theme.spacings.small,
      backgroundColor: theme.interactive[interactiveColor].default.background,
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
      borderWidth: theme.border.width.slim,
      borderColor: theme.static.background.background_2.background,
    },
    contentContainer: {
      padding: theme.spacings.xLarge,
      flexGrow: 1,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacings.xLarge,
      paddingVertical: theme.spacings.medium,
      backgroundColor: theme.interactive[interactiveColor].outline.background,
    },
    buttonText: {
      color: theme.interactive[interactiveColor].outline.text,
    },
  }))();
