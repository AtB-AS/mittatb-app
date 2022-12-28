import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {RadioIcon} from './RadioIcon';
import React from 'react';

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
}: Props) {
  const styles = useStyles();
  const {theme} = useTheme();
  const spacing = useSpacing(type);

  const themeColor: StaticColorByType<'background'> = selected
    ? 'background_accent_3'
    : 'background_0';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.static.background[themeColor].background,
          padding: spacing,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityLabel={a11yLabel}
      accessibilityHint={a11yHint}
      accessibilityRole={'radio'}
      accessibilityState={{
        selected,
        disabled,
      }}
      disabled={disabled}
      testID={testID}
    >
      <ThemeText
        type="heading__title"
        color={themeColor}
        style={{...styles.title, marginBottom: spacing}}
      >
        {title}
      </ThemeText>
      <View style={{...styles.icon, marginBottom: spacing}}>{icon}</View>
      <ThemeText
        type="body__secondary"
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
        <RadioIcon checked={selected} color={themeColor} />
      </View>
    </TouchableOpacity>
  );
}

function useSpacing(type: ContainerSizingType) {
  const {theme} = useTheme();
  switch (type) {
    case 'compact':
      return theme.spacings.small;
    case 'standard':
      return theme.spacings.medium;
    case 'spacious':
      return theme.spacings.xLarge;
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
    marginBottom: theme.spacings.large,
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
