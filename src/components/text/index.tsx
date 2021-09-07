import {useTheme} from '@atb/theme';
import {
  isThemeColor,
  TextColor,
  TextNames,
  ThemeColor,
} from '@atb/theme/colors';
import React from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import renderMarkdown from './markdown-renderer';

export const MAX_FONT_SCALE = 2;

export type ThemeTextProps = TextProps & {
  type?: TextNames;
  color?: TextColor | ThemeColor;
  isMarkdown?: boolean;
};

const ThemeText: React.FC<ThemeTextProps> = ({
  type: fontType = 'body__primary',
  color = 'primary',
  isMarkdown = false,
  style,
  children,
  ...props
}) => {
  const {theme, overrideSystemFont} = useTheme();

  const typeStyle = {
    ...theme.typography[fontType],
    color: isThemeColor(theme, color)
      ? theme.colors[color].color
      : theme.text.colors[color],
  };

  let textStyle: TextStyle = typeStyle;

  if (overrideSystemFont) {
    textStyle = {
      ...typeStyle,
      fontFamily:
        typeStyle.fontWeight === 'bold' ? 'Roboto-Bold' : 'Roboto-Regular',
      fontWeight: 'normal',
    };
  }

  const content =
    isMarkdown && typeof children === 'string'
      ? renderMarkdown(children)
      : children;

  return (
    <Text
      style={[textStyle, style]}
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      {...props}
    >
      {content}
    </Text>
  );
};

export default ThemeText;
