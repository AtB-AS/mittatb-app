import {useTheme} from '@atb/theme';
import {
  TextColor,
  TextNames,
  StaticColor,
  isStaticColor,
  getStaticColor,
} from '@atb/theme/colors';
import React from 'react';
import {Platform, Text, TextProps, TextStyle} from 'react-native';
import renderMarkdown from './markdown-renderer';
import {ContrastColor} from '@atb-as/theme';

export const MAX_FONT_SCALE = 2;

type ColorType = TextColor | StaticColor | ContrastColor;

export type ThemeTextProps = TextProps & {
  type?: TextNames;
  color?: ColorType;
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
  const {theme, useAndroidSystemFont} = useTheme();
  const textColor = useColor(color);

  const typeStyle = {
    ...theme.typography[fontType],
    color: textColor,
  };

  let textStyle: TextStyle = typeStyle;

  if (Platform.OS === 'android' && !useAndroidSystemFont) {
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

const useColor = (color: ColorType): string => {
  const {theme, themeName} = useTheme();

  if (typeof color !== 'string') {
    return color.text;
  }
  return isStaticColor(color)
    ? getStaticColor(themeName, color).text
    : theme.text.colors[color];
};

export default ThemeText;
