import {InteractiveColor} from '@atb/theme/colors';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {NativeButton} from '@atb/components/native-button';
import {useTranslation} from '@atb/translations';
import {getRadioA11y} from '@atb/components/radio';

type Props = {
  color: InteractiveColor;
  text: string;
  selected: boolean;
  onPress: () => void;
};

export const ProductAliasChip = ({color, text, selected, onPress}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();

  const currentColor = color[selected ? 'active' : 'default'];

  // To make items with and without border the same size, we subtract the border
  // width from the padding when there is a border.
  const borderOffset = selected ? theme.border.width.medium : 0;

  return (
    <NativeButton
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
      {...getRadioA11y(text, selected, t)}
      testID={'chip' + text.replace(' ', '')}
    >
      <ThemeText
        color={currentColor}
        typography={selected ? 'body__s__strong' : 'body__s'}
      >
        {text}
      </ThemeText>
    </NativeButton>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    borderRadius: theme.border.radius.large * 2,
    marginRight: theme.spacing.small,
    justifyContent: 'center',
  },
}));
