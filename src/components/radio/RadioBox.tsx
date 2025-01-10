import {View, ViewStyle} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {RadioIcon} from './RadioIcon';
import React from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {InteractiveColor} from '@atb/theme/colors';

type ContainerSizingType = 'compact' | 'standard' | 'spacious';

type Props = {
  title: string;
  description: string;
  a11yLabel: string;
  a11yHint: string;
  disabled: boolean;
  selected: boolean;
  icon: JSX.Element;
  type?: ContainerSizingType;
  onPress: () => void;
  style?: ViewStyle;
  testID?: string;
  interactiveColor?: InteractiveColor;
};
export function RadioBox({
  title,
  description,
  a11yLabel,
  a11yHint,
  disabled,
  selected,
  icon,
  type = 'standard',
  onPress,
  style,
  testID,
  interactiveColor,
}: Props) {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const spacing = useSpacing(type);

  const currentInteractiveColor =
    interactiveColor ?? theme.color.interactive[2];
  const themeColor = currentInteractiveColor[selected ? 'active' : 'default'];
  const {
    background: backgroundColor,
    foreground: {primary: textColor},
  } = themeColor;

  return (
    <PressableOpacity
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          padding: spacing,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityLabel={a11yLabel}
      accessibilityHint={a11yHint}
      accessibilityRole="radio"
      accessibilityState={{
        selected,
        disabled,
      }}
      disabled={disabled}
      testID={testID}
    >
      <ThemeText
        typography="heading__title"
        color={themeColor}
        style={{...styles.title, marginBottom: spacing}}
      >
        {title}
      </ThemeText>
      <View style={{...styles.icon, marginBottom: spacing}}>{icon}</View>
      <ThemeText
        typography="body__secondary"
        color={themeColor}
        style={{...styles.description, marginBottom: spacing}}
        accessible={false}
      >
        {description}
      </ThemeText>
      <View
        style={styles.radioIcon}
        testID={testID + (selected ? 'RadioChecked' : 'RadioNotChecked')}
      >
        <RadioIcon checked={selected} color={textColor} />
      </View>
    </PressableOpacity>
  );
}

function useSpacing(type: ContainerSizingType) {
  const {theme} = useThemeContext();
  switch (type) {
    case 'compact':
      return theme.spacing.small;
    case 'standard':
      return theme.spacing.medium;
    case 'spacious':
      return theme.spacing.xLarge;
  }
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flex: 1,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  title: {
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  icon: {
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
  },
  radioIcon: {
    alignItems: 'center',
  },
}));
