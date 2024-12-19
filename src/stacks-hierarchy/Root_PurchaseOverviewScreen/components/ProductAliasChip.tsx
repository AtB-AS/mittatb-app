import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  color: InteractiveColor;
  text: string;
  selected: boolean;
  onPress: () => void;
};

export const ProductAliasChip = ({color, text, selected, onPress}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();

  const currentColor = color[selected ? 'active' : 'default'];

  // To make items with and without border the same size, we subtract the border
  // width from the padding when there is a border.
  const borderOffset = selected ? theme.border.width.medium : 0;

  return (
    <PressableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentColor.background,
          borderColor: color.outline.background,
          borderWidth: borderOffset,
          paddingVertical: theme.spacing.medium - borderOffset,
          paddingHorizontal: theme.spacing.xLarge - borderOffset,
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
        typography={selected ? 'body__secondary--bold' : 'body__secondary'}
      >
        {text}
      </ThemeText>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    borderRadius: theme.border.radius.circle * 2,
    marginRight: theme.spacing.small,
    justifyContent: 'center',
  },
}));
