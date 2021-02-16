import {useTheme} from '@atb/theme';
import {TextColor, TextNames} from '@atb/theme/colors';
import React from 'react';
import {Text, TextProps} from 'react-native';

export const MAX_FONT_SCALE = 2;

export type ThemeTextProps = TextProps & {
  type?: TextNames;
  color?: TextColor;
};

const ThemeText: React.FC<ThemeTextProps> = ({
  type: fontType = 'body',
  color = 'primary',
  style,
  children,
  ...props
}) => {
  const {theme} = useTheme();

  const typeStyle = {
    ...theme.text[fontType],
    color: theme.text.colors[color],
  };

  return (
    <Text
      style={[typeStyle, style]}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      {...props}
    >
      {children}
    </Text>
  );
};
export default ThemeText;
