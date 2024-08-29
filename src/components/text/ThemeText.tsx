import React from 'react';
import {useTheme} from '@atb/theme';
import {ColorValue, Platform, Text, TextProps, TextStyle} from 'react-native';
import {renderMarkdown} from './markdown-renderer';
import {MAX_FONT_SCALE} from './utils';
import {
  ContrastColor,
  Statuses,
  TextColor,
  TextNames,
  useColor,
} from '@atb/theme/colors';

export type ThemeTextProps = TextProps & {
  type?: TextNames;
  color?: ContrastColor | Statuses | TextColor | ColorValue;
  isMarkdown?: boolean;
};

export const ThemeText: React.FC<ThemeTextProps> = ({
  type: fontType = 'body__primary',
  color,
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
  // Set specific letter spacing for android phones, as 0.4 leads to errors on newer pixel phones
  // https://github.com/facebook/react-native/issues/35039
  if (
    Platform.OS === 'android' &&
    (textStyle.letterSpacing === 0.4 || textStyle.letterSpacing === 1.6)
  ) {
    textStyle = {
      ...textStyle,
      letterSpacing: textStyle.letterSpacing - 0.01,
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
