import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet, useTheme} from '@atb/theme';
import {TouchableOpacity} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';

type Props = {
  color: InteractiveColor;
  text: string;
  selected: boolean;
  onPress: () => void;
};

export const ProductAliasChip = ({color, text, selected, onPress}: Props) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const currentColor =
    theme.interactive[color][selected ? 'active' : 'default'];

  // To make items with and without border the same size, we subtract the border
  // width from the padding when there is a border.
  const borderOffset = selected ? theme.border.width.medium : 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentColor.background,
          borderColor: theme.interactive[color].outline.background,
          borderWidth: borderOffset,
          paddingVertical: theme.spacings.medium - borderOffset,
          paddingHorizontal: theme.spacings.xLarge - borderOffset,
        },
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityLabel={text}
      testID={'chip' + text.replace(' ', '')}
    >
      <ThemeText
        color={currentColor}
        type={selected ? 'body__secondary--bold' : 'body__secondary'}
      >
        {text}
      </ThemeText>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    justifyContent: 'center',
    borderRadius: theme.border.radius.circle * 2,
    marginRight: theme.spacings.small,
  },
}));
